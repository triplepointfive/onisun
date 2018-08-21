import { CreatureEvent } from '../events/internal'

import { Point } from '../utils/utils'
import { Fov } from '../utils/fov'

import {
  Characteristics,
  Corpse,
  LevelMap,
  LevelMapId,
  Memory,
  Inventory,
  Game,
  ImpactBunch,
  MetaAI,
  PlayerAI,
} from '../../engine'

import { Level } from '../lib/level'
import { includes } from 'lodash'
import { Profession } from './profession'
import { TileVisitor, Door, Tile, Trap } from './tile'
import { ImpactType } from '../lib/impact'
import { Stat } from '../lib/stat'

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

class SteppingTileVisitor extends TileVisitor {
  constructor(private creature: Creature, private game: Game) {
    super()
  }

  public onTrap(trap: Trap): void {
    trap.activate(this.game, this.creature)
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
  public carryingCapacity: Stat

  constructor(
    public characteristics: Characteristics,
    ai: MetaAI,
    specie: Specie
  ) {
    super(specie)
    this.ai = ai

    this.inventory = new Inventory()

    this.stuffWeight = new Stat(0)
    this.carryingCapacity = new Stat(100)
  }

  public addToMap(pos: Point, level: LevelMap) {
    this.pos = pos
    this.previousPos = this.pos.copy()
    this.currentLevel = level
    level.addCreature(this)
    this.visionMask(level)
  }

  public die(): void {
    this.currentLevel.removeCreature(this)
    this.dead = true

    let tile = this.currentLevel.at(this.pos.x, this.pos.y)
    tile.addItem(new Corpse(this.specie), 1)

    this.inventory.slots().forEach(({ equipment }) => {
      if (equipment) {
        tile.addItem(equipment.item, equipment.count)
      }
    })

    this.inventory.cares().forEach(invItem => {
      tile.addItem(invItem.item, invItem.count)
    })
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

  public act(stage: LevelMap) {
    this.visionMask(stage)
    this.previousPos = this.pos.copy()
    this.ai.act(this, true)
  }

  public move(nextPoint: Point, nextLevel = this.currentLevel) {
    if (nextLevel.id !== this.currentLevel.id) {
      this.currentLevel.leave(this)

      nextLevel.enter(this, nextPoint)
      nextLevel.game.currentMap = nextLevel
      this.currentLevel = nextLevel
    } else {
      this.currentLevel.at(this.pos.x, this.pos.y).creature = undefined
    }

    this.pos = nextPoint.copy()

    this.currentLevel.at(this.pos.x, this.pos.y).creature = this

    this.currentLevel
      .at(this.pos.x, this.pos.y)
      .visit(new SteppingTileVisitor(this, this.currentLevel.game))
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

    const visitor = new VisibilityTileVisitor(this, stage)

    new Fov(
      this.pos.x,
      this.pos.y,
      this.radius(),
      stage.width,
      stage.height,
      visitor,
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

  public impacts(): ImpactType[] {
    if (this.impactsBunch) {
      return this.impactsBunch.activeImpacts()
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
