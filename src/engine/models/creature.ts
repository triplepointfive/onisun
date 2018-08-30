import { includes } from 'lodash'
import {
  Characteristics,
  Game,
  ImpactBunch,
  Inventory,
  LevelMap,
  Memory,
  PlayerAI,
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
import { Protection, Damage, DamageType } from './items'

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
  public inventory: Inventory

  public dead: boolean = false

  private impactsBunch: ImpactBunch | undefined

  public stuffWeight: Stat
  public carryingCapacity: CapacityLimitStat

  constructor(
    public characteristics: Characteristics,
    public specie: Specie,
    public id: CreatureId = Creature.getId()
  ) {
    this.inventory = new Inventory()

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
    return [{ extra: 0, dice: { times: 4, max: 3 }, type: DamageType.Blunt }]
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
}

export class AICreature extends Creature {
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
}

export class Player extends Creature {
  public professions: Profession[] = []

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
}
