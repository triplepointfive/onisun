import { concat, includes } from 'lodash'
import {
  Characteristics,
  Game,
  GroupedItem,
  ImpactBunch,
  Inventory,
  LevelMap,
  Memory,
  PlayerAI,
} from '../../engine'
import { MetaAI } from '../ai/meta_ai'
import { AfterEvent } from '../events/after_event'
import { CreatureEvent } from '../events/internal'
import { ItemsBunch } from '../lib/bunch'
import { ImpactType } from '../lib/impact'
import { Level } from '../lib/level'
import { buildFov } from '../lib/map_fov'
import { CapacityLimitStat, Stat } from '../lib/stat'
import {
  Damage,
  DamageType,
  Item,
  Missile,
  Protection,
  ProtectionType,
} from './items'
import { Profession } from './profession'

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

export interface Specie {
  readonly name: string
  readonly weight: number
  readonly clan: Clan
  readonly abilities: Ability[]
  protections: Protection[]
  damages: Damage[]
  throwingItem?: Missile
}

export type CreatureId = number

export enum Reaction {
  DIE,
  HURT,
  DODGE,
  THROW_DODGE,
  NOTHING,
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
    return this.specie.damages
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

  public visionMask(levelMap: LevelMap): void {
    let memory = this.stageMemory(levelMap)

    if (memory) {
      memory.resetVisible()
    } else {
      this.stageMemories[levelMap.id] = memory = new Memory(
        levelMap.width,
        levelMap.height
      )
    }

    buildFov(levelMap.creaturePos(this), this.radius(), memory, levelMap)
  }

  public abstract act(levelMap: LevelMap, game: Game): void

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

  public itemsProtections: Protection[] = []

  constructor(
    public level: Level,
    characteristics: Characteristics,
    public ai: PlayerAI,
    specie: Specie
  ) {
    super(characteristics, specie)
    this.itemsProtections = [
      { type: ProtectionType.Heavy, value: 4 },
      { type: ProtectionType.Unarmored, value: 20 },
    ]
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

  get protections(): Protection[] {
    return concat(this.specie.protections, this.itemsProtections)
  }
}
