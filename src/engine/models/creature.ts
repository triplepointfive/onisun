import { CreatureEvent } from '../events/internal'
import { Point } from '../utils/utils'
import { Fov } from '../utils/fov'

import {
  Characteristics,
  LevelMap,
  LevelMapId,
  Memory,
  Inventory,
  ImpactBunch,
  MetaAI,
  PlayerAI,
  Game,
} from '../../engine'

import { Level } from '../lib/level'
import { includes } from 'lodash'
import { Profession } from './profession'
import { TileVisitor, Door, Tile } from './tile'
import { ImpactType } from '../lib/impact'
import { Stat, CapacityLimitStat } from '../lib/stat'

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
    public readonly clan: Clan,
    public readonly abilities: Ability[]
  ) {}
}

export type CreatureId = number

export class Phantom {
  private static lastId: CreatureId = 0
  public static getId(): CreatureId {
    return this.lastId++
  }

  public refToReal?: Creature

  constructor(public specie: Specie, public id: CreatureId = Phantom.getId()) {}

  public name(): string {
    return this.specie.name
  }

  public clan(): Clan {
    return this.specie.clan
  }

  public clone(): Phantom {
    return new Phantom(this.specie, this.id)
  }

  public real(): Creature {
    return this.refToReal
  }

  public can(ability: Ability) {
    return includes(this.specie.abilities, ability)
  }
}

export enum Reaction {
  DIE,
  HURT,
  DODGE,
  THROW_DODGE,
  NOTHING,
}

class VisibilityTileVisitor extends TileVisitor {
  public visible: boolean = false
  private x: number
  private y: number

  constructor(private creature: Creature, private stage: LevelMap) {
    super()
  }

  public isSolid(x: number, y: number): boolean {
    this.x = x
    this.y = y
    this.stage.at(x, y).visit(this)
    return !this.visible
  }

  public onDoor(door: Door) {
    this.visible =
      this.creature.pos.x === this.x && this.creature.pos.y === this.y
  }

  protected default(tile: Tile) {
    this.visible = this.stage.visibleThrough(this.x, this.y)
  }
}

export class Creature extends Phantom {
  public ai: MetaAI
  public stageMemories: { [key: string]: Memory } = {}
  public currentLevel: LevelMap
  public inventory: Inventory

  public previousPos: Point
  public pos: Point
  public dead: boolean = false

  private impactsBunch: ImpactBunch

  public stuffWeight: Stat
  public carryingCapacity: CapacityLimitStat

  constructor(
    public characteristics: Characteristics,
    ai: MetaAI,
    specie: Specie
  ) {
    super(specie)
    this.ai = ai

    this.inventory = new Inventory()

    this.stuffWeight = new Stat(0)
    this.carryingCapacity = new CapacityLimitStat(1, 4)
  }

  public addToMap(pos: Point, level: LevelMap) {
    this.pos = pos
    this.previousPos = this.pos.copy()
    this.currentLevel = level
    level.addCreature(this)
    this.visionMask(level)
  }

  public on(event: CreatureEvent): Reaction {
    return event.affectCreature(this)
  }

  public real(): Creature {
    return this
  }

  public speed(): number {
    return this.characteristics.speed.currentValue()
  }

  public radius(): number {
    return this.characteristics.radius.currentValue()
  }

  public stageMemory(levelId: LevelMapId = this.currentLevel.id): Memory {
    return this.stageMemories[levelId]
  }

  public act(stage: LevelMap, game: Game) {
    this.visionMask(stage)
    this.previousPos = this.pos.copy()
    this.ai.act(this, game, true)
  }

  public clone(): Phantom {
    let phantom = new Phantom(this.specie, this.id)
    phantom.refToReal = this
    return phantom
  }

  public visionMask(stage: LevelMap): void {
    if (!this.stageMemories[stage.id]) {
      this.stageMemories[stage.id] = new Memory(stage.width, stage.height)
    } else {
      this.stageMemory().resetVisible()
    }

    const see = (x: number, y: number, degree: number): void => {
      this.stageMemory()
        .at(x, y)
        .see(stage.at(x, y), degree)
    }

    new Fov(
      this.pos.x,
      this.pos.y,
      this.radius(),
      stage.width,
      stage.height,
      new VisibilityTileVisitor(this, stage),
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
    this.impactsBunch.removeConstImpact(type, effect)
  }

  get impacts(): ImpactType[] {
    if (this.impactsBunch) {
      return this.impactsBunch.activeImpacts
    }

    return []
  }
}

export class Player extends Creature {
  public ai: PlayerAI
  public professions: Profession[] = []

  constructor(
    public level: Level,
    characteristics: Characteristics,
    ai: PlayerAI,
    specie: Specie
  ) {
    super(characteristics, ai, specie)
  }

  public rebuildVision(): void {
    this.visionMask(this.currentLevel)
  }

  public on(event: CreatureEvent): Reaction {
    return event.affectPlayer(this)
  }
}
