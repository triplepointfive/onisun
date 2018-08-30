import { includes } from 'lodash'
import {
  Characteristics,
  Game,
  ImpactBunch,
  Inventory,
  LevelMap,
  Memory,
  PlayerAI,
  GroupedItem,
} from '../../engine'
import { CreatureEvent } from '../events/internal'
import { ImpactType } from '../lib/impact'
import { Level } from '../lib/level'
import { CapacityLimitStat, Stat } from '../lib/stat'
import { Fov } from '../utils/fov'
import { Point } from '../utils/utils'
import { Profession } from './profession'
import { Door, Tile, TileVisitor } from './tile'
import { AfterEvent } from '../events/after_event'
import { MetaAI } from '../ai/meta_ai'
import { Protection, Damage, DamageType, Missile, Item } from './items'
import { ItemsBunch } from '../lib/bunch'

export enum Clan {
  Player,
  PlayerOnlyEnemy,
  FreeForAll,
}

export enum Ability {
  GoStairwayDown,
  Inventory,
  PutOn,
  Throwing,
}

export const allAbilities = [
  Ability.GoStairwayDown,
  Ability.Inventory,
  Ability.PutOn,
  Ability.Throwing,
]

export class Specie {
  constructor(
    public readonly name: string,
    public readonly weight: number,
    public readonly clan: Clan,
    public readonly abilities: Ability[],
    public protections: Protection[]
  ) {}

  public throwingItem?: Missile
}

export type CreatureId = number

export enum Reaction {
  DIE,
  HURT,
  DODGE,
  THROW_DODGE,
  NOTHING,
}

class VisibilityTileVisitor extends TileVisitor {
  public visible: boolean = false
  private x: number | undefined
  private y: number | undefined

  constructor(private stage: LevelMap, private pos: Point) {
    super()
  }

  public isSolid(x: number, y: number): boolean {
    this.x = x
    this.y = y
    this.stage.at(x, y).visit(this)
    return !this.visible
  }

  public onDoor(door: Door) {
    this.visible = this.pos.x === this.x && this.pos.y === this.y
  }

  protected default(tile: Tile) {
    if (this.x && this.y) {
      this.visible = this.stage.visibleThrough(this.x, this.y)
    }
  }
}

export abstract class Creature {
  private static lastId: CreatureId = 0
  public static getId(): CreatureId {
    return this.lastId++
  }

  protected stageMemories: { [key: string]: Memory } = {}

  public dead: boolean = false

  private impactsBunch: ImpactBunch | undefined

  public stuffWeight: Stat
  public carryingCapacity: CapacityLimitStat

  constructor(
    public characteristics: Characteristics,
    public specie: Specie,
    public id: CreatureId = Creature.getId()
  ) {
    this.stuffWeight = new Stat(0)
    this.carryingCapacity = new CapacityLimitStat(1, 4)
  }

  get name(): string {
    return this.specie.name
  }

  get clan(): Clan {
    return this.specie.clan
  }

  get protections(): Protection[] {
    return this.specie.protections
  }

  get damages(): Damage[] {
    return [{ extra: 0, dice: { times: 4, max: 3 }, type: DamageType.Melee }]
  }

  public can(ability: Ability) {
    return includes(this.specie.abilities, ability)
  }

  public on(event: CreatureEvent): Reaction {
    return event.affectCreature(this)
  }

  public speed(): number {
    return this.characteristics.speed.currentValue
  }

  public radius(): number {
    return this.characteristics.radius.currentValue
  }

  public stageMemory(levelMap: LevelMap): Memory {
    return this.stageMemories[levelMap.id]
  }

  public abstract act(levelMap: LevelMap, game: Game): void

  public visionMask(stage: LevelMap): void {
    if (!this.stageMemories[stage.id]) {
      this.stageMemories[stage.id] = new Memory(stage.width, stage.height)
    } else {
      this.stageMemory(stage).resetVisible()
    }

    const see = (x: number, y: number, degree: number): void => {
      this.stageMemory(stage)
        .at(x, y)
        .see(stage.at(x, y), degree)
    }

    const pos = stage.creaturePos(this)

    new Fov(
      pos.x,
      pos.y,
      this.radius(),
      stage.width,
      stage.height,
      new VisibilityTileVisitor(stage, pos),
      see
    ).calc()
  }

  public addImpact(type: ImpactType, effect: string): void {
    if (!this.impactsBunch) {
      this.impactsBunch = new ImpactBunch()
    }

    this.impactsBunch.addConstImpact(type, effect)
  }

  public removeImpact(type: ImpactType, effect: string): void {
    // TODO: Should never get here
    if (!this.impactsBunch) {
      this.impactsBunch = new ImpactBunch()
    }

    this.impactsBunch.removeConstImpact(type, effect)
  }

  get impacts(): ImpactType[] {
    if (this.impactsBunch) {
      return this.impactsBunch.activeImpacts
    }

    return []
  }

  abstract get missile(): GroupedItem<Missile> | undefined
  abstract get inventoryItems(): GroupedItem<Item>[]

  public abstract addItem(item: Item, count: number): void
  public abstract removeItem(item: Item, count: number): void
}

export class AICreature extends Creature {
  private bag?: ItemsBunch<Item>

  constructor(
    characteristics: Characteristics,
    public ai: MetaAI,
    specie: Specie,
    id: CreatureId = Creature.getId()
  ) {
    super(characteristics, specie, id)
  }

  public act(levelMap: LevelMap, game: Game): void {
    this.visionMask(levelMap)

    const command = this.ai.act(this, levelMap, game)
    if (command) {
      this.on(command)
    }

    this.on(new AfterEvent(levelMap, game))
  }

  get missile(): GroupedItem<Missile> | undefined {
    // TODO: Remove perpetuum items?
    if (this.specie.throwingItem) {
      return { item: this.specie.throwingItem, count: 1 }
    }
  }

  get inventoryItems(): GroupedItem<Item>[] {
    return this.bag ? this.bag.bunch : []
  }

  public addItem(item: Item, count: number): void {
    if (!this.bag) {
      this.bag = new ItemsBunch()
    }

    this.bag.put(item, count)
  }

  public removeItem(item: Item, count: number): void {
    if (!this.bag) {
      throw `Creature ${this.name} tried to remove item ${
        item.name
      } but it does not present`
    }

    this.bag.remove(item, count)
  }
}

export class Player extends Creature {
  public professions: Profession[] = []
  public inventory: Inventory = new Inventory()

  constructor(
    public level: Level,
    characteristics: Characteristics,
    public ai: PlayerAI,
    specie: Specie
  ) {
    super(characteristics, specie)
  }

  public act(levelMap: LevelMap, game: Game): void {
    this.visionMask(levelMap)

    const command = this.ai.act(this, levelMap, game)
    if (command) {
      this.on(command)
    }

    this.on(new AfterEvent(levelMap, game))
  }

  public rebuildVision(levelMap: LevelMap): void {
    this.visionMask(levelMap)
  }

  public on(event: CreatureEvent): Reaction {
    return event.affectPlayer(this)
  }

  get protections(): Protection[] {
    // TODO: Add inventors protection
    return this.specie.protections
  }

  get missile(): GroupedItem<Missile> | undefined {
    return this.inventory.missileSlot.equipment
  }

  get inventoryItems(): GroupedItem<Item>[] {
    return this.inventory.allItems
  }

  public addItem(item: Item, count: number): void {
    this.inventory.putToBag(item, count)
  }

  public removeItem(item: Item, count: number): void {
    this.inventory.removeFromBag(item, count)
  }
}
