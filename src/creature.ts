import { Point } from './utils'
import { MetaAI } from './ai'
import { Fov } from './fov'
import { Equipment } from './items'

import { Characteristics, Corpse, LevelMap, LevelMapId, Memory } from './engine'
import { Inventory, BodyPart } from './inventory'

import { Level } from './level'
import { includes } from 'lodash'

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
  constructor(public actor: Creature) { super() }

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

export class AddExperienceEvent extends Event {
  constructor(public actor: Creature) { super() }

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
  NOTHING,
}

export enum Clan {
  Player,
  PlayerOnlyEnemy,
  FreeForAll,
}

export enum Ability {
  GoStairwayDown,
  Inventory,
  PutOn,
}

export const allAbilities = Object.keys(Ability).map(key => Ability[key])

export class Specie {
  constructor(
    public readonly name: string,
    public readonly clan: Clan,
    public readonly abilities: Ability[]
  ) {}
}

export class Creature extends Phantom {
  public ai: MetaAI
  public stageMemories: { [key: string]: Memory } = {}
  public currentLevel: LevelMap
  public inventory: Inventory

  public previousPos: Point
  public previousLevel: LevelMap
  public pos: Point

  constructor(
    public characteristics: Characteristics,
    ai: MetaAI,
    specie: Specie
  ) {
    super(specie)
    this.ai = ai
    this.inventory = new Inventory([
      BodyPart.LeftHand,
      BodyPart.RightHand,
      BodyPart.Legs,
      BodyPart.Finger,
      BodyPart.Head,
      BodyPart.Eye,
      BodyPart.Neck,
      BodyPart.Back,
      BodyPart.Body,
    ])
  }

  public putOn(item: Equipment) {
    this.inventory.equip(this, item)
    this.inventory.removeFromBag(item)
  }

  public takeOff(item: Equipment) {
    this.inventory.takeOff(this, item)
  }

  public addToMap(pos: Point, level: LevelMap) {
    this.pos = pos
    this.previousLevel = this.currentLevel
    this.currentLevel = level
    level.addCreature(this)
    this.visionMask(level)
  }

  public die(): void {
    this.currentLevel.removeCreature(this)

    let tile = this.currentLevel.at(this.pos.x, this.pos.y)
    tile.items.push(new Corpse(this))

    this.inventory.wears().forEach(({ equipment }) => {
      if (equipment) {
        tile.items.push(equipment)
      }
    })

    this.inventory.cares().forEach(item => {
      tile.items.push(item)
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

  public act(stage: LevelMap): void {
    this.visionMask(stage)
    this.previousPos = this.pos.copy()
    this.ai.act(this, true)

    let previousPosLevel = this.previousLevel || this.currentLevel
    previousPosLevel.at(
      this.previousPos.x,
      this.previousPos.y
    ).creature = undefined
    this.currentLevel.at(this.pos.x, this.pos.y).creature = this

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

    new Fov(
      this.pos.x,
      this.pos.y,
      this.radius(),
      stage.width,
      stage.height,
      this.isSolid(stage),
      see
    ).calc()
  }

  private isSolid(stage: LevelMap): (x: number, y: number) => boolean {
    return (x: number, y: number) => {
      if (stage.visibleThrough(x, y)) {
        return false
      } else {
        return !(
          stage.at(x, y).isDoor() &&
          this.pos.x === x &&
          this.pos.y === y
        )
      }
    }
  }
}

export class Player extends Creature {
  public dead: boolean = false

  public levelUps: number = 0

  constructor(
    public level: Level,
    characteristics: Characteristics,
    ai: MetaAI,
    specie: Specie
  ) {
    super(characteristics, ai, specie)
  }

  public act(stage: LevelMap) {
    while (this.levelUps > 0) {
      this.characteristics.levelUp(this.specie)

      this.levelUps -= 1
    }

    super.act(stage)
  }

  public die(): void {
    super.die() // We do not want player to act after they death
    this.dead = true
  }
}
