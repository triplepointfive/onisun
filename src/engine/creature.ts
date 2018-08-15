import { Point } from './utils'
import { MetaAI } from './ai'
import { Fov } from './fov'

import {
  Characteristics,
  Corpse,
  LevelMap,
  LevelMapId,
  Memory,
  Inventory,
  Game,
} from '../engine'

import { Level } from './level'
import { includes } from 'lodash'
import { Item } from './items'
import { Profession } from './profession'
import { TileVisitor, Door, Tile, Trap } from './tile'

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

export const allAbilities = Object.keys(Ability).map(key => Ability[key])

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

export abstract class Event {
  public abstract affect(subject: Creature): Reaction
}

export class AttackEvent extends Event {
  constructor(public actor: Creature) {
    super()
  }

  public affect(subject: Creature): Reaction {
    if (this.actor.characteristics.misses(subject.characteristics)) {
      subject.currentLevel.game.logger.missMessage(this.actor, subject)
      return Reaction.DODGE
    }

    const damage = this.actor.characteristics.damageTo(subject.characteristics)

    if (damage >= subject.characteristics.health.currentValue()) {
      this.actor.on(new AddExperienceEvent(subject))
      subject.currentLevel.game.logger.killMessage(damage, this.actor, subject)
      subject.die()
      return Reaction.DIE
    } else {
      subject.characteristics.health.decrease(damage)
      subject.currentLevel.game.logger.hurtMessage(damage, this.actor, subject)
      return Reaction.HURT
    }
  }
}

export class TrapEvent extends Event {
  constructor(private trap: Trap) {
    super()
  }

  public affect(actor: Creature): Reaction {
    const damage = 10,
      game = actor.currentLevel.game

    // TODO: Special messages for dying.
    if (game.player.stageMemory().at(actor.pos.x, actor.pos.y).visible) {
      if (game.player.id === actor.id) {
        game.logger.youSteppedInTrap()
      } else {
        game.logger.creatureSteppedInTrap(actor)
      }
    }

    if (damage >= actor.characteristics.health.currentValue()) {
      actor.die()
      return Reaction.DIE
    } else {
      actor.characteristics.health.decrease(damage)
      return Reaction.HURT
    }
  }
}

export class ThrowEvent extends Event {
  constructor(public actor: Creature, public missile: Item) {
    super()
  }

  public affect(subject: Creature): Reaction {
    if (this.actor.characteristics.throwMisses(subject.characteristics)) {
      subject.currentLevel.game.logger.throwMissMessage(
        this.actor,
        subject,
        this.missile
      )
      return Reaction.THROW_DODGE
    }

    const damage = this.actor.characteristics.throwDamageTo(
      subject.characteristics,
      this.missile
    )

    if (damage >= subject.characteristics.health.currentValue()) {
      this.actor.on(new AddExperienceEvent(subject))
      subject.currentLevel.game.logger.throwKillMessage(
        damage,
        this.actor,
        subject,
        this.missile
      )
      subject.die()
      return Reaction.DIE
    } else {
      subject.characteristics.health.decrease(damage)
      subject.currentLevel.game.logger.throwHurtMessage(
        damage,
        this.actor,
        subject,
        this.missile
      )
      return Reaction.HURT
    }
  }
}

export class AddExperienceEvent extends Event {
  constructor(public actor: Creature) {
    super()
  }

  public affect(subject: Creature): Reaction {
    if (subject instanceof Player) {
      subject.levelUps += subject.level.add(1)
    }

    return Reaction.NOTHING
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
  public previousLevel: LevelMap
  public pos: Point
  public dead: boolean = false

  constructor(
    public characteristics: Characteristics,
    ai: MetaAI,
    specie: Specie
  ) {
    super(specie)
    this.ai = ai

    this.inventory = new Inventory()
  }

  public addToMap(pos: Point, level: LevelMap) {
    this.pos = pos
    this.previousPos = this.pos.copy()
    this.previousLevel = this.currentLevel
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

  public on(event: Event): Reaction {
    return event.affect(this)
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

    let previousPosLevel = this.previousLevel || this.currentLevel
    previousPosLevel.at(
      this.previousPos.x,
      this.previousPos.y
    ).creature = undefined
    this.currentLevel.at(this.pos.x, this.pos.y).creature = this

    this.currentLevel
      .at(this.pos.x, this.pos.y)
      .visit(new SteppingTileVisitor(this, this.currentLevel.game))

    this.previousLevel = undefined
  }

  public move(nextPoint: Point) {
    this.pos = nextPoint.copy()
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
}

export class Player extends Creature {
  public levelUps: number = 0
  public professions: Profession[] = []

  constructor(
    public level: Level,
    characteristics: Characteristics,
    ai: MetaAI,
    specie: Specie
  ) {
    super(characteristics, ai, specie)
  }

  public move(dest: Point) {
    super.move(dest)

    let previousPosLevel = this.previousLevel || this.currentLevel
    previousPosLevel.at(
      this.previousPos.x,
      this.previousPos.y
    ).creature = undefined
    this.currentLevel.at(this.pos.x, this.pos.y).creature = this

    this.previousLevel = undefined

    this.currentLevel
      .at(this.pos.x, this.pos.y)
      .visit(new SteppingTileVisitor(this, this.currentLevel.game))
  }

  public rebuildVision(): void {
    this.visionMask(this.currentLevel)
  }
}
