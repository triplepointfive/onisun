import { Mapped, Point, twoDimArray } from './utils'
import { AI } from './ai'
import { Fov } from './fov'

import { LevelMap, LevelMapId, Tile } from './map'
import { Logger } from './logger'

export class MemoryTile  {
  public visible: boolean = false
  public degree: number = 0
  public seen: boolean = false

  constructor(
    public tile?: Tile,
  ) {
  }

  public see(tile: Tile, degree: number) {
    this.visible = true
    this.degree = degree
    this.seen = true
    this.tile = tile.clone()
  }

  public tangible(actor?: Creature): boolean {
    return this.seen && !this.tile.passibleThrough(actor)
  }

  public creature(): Phantom {
    return this.tile && this.tile.creature
  }

  public reset(): void {
    this.visible = false
    this.tile.creature = undefined
  }
}

export class Memory extends Mapped<MemoryTile> {
  constructor(
    width: number,
    height: number,
  ) {
    const baseTile = Tile.retrive('W')
    super(twoDimArray(height, width, () => new MemoryTile(baseTile)))
  }

  public inRange(point: Point): boolean {
    return point.x >= 0         && point.y >= 0
        && point.x < this.width && point.y < this.height
  }

  public resetVisible(): void {
    this.map.forEach((row) => {
      row.forEach((tile) => {
        tile.reset()
      })
    })
  }
}

export type CreatureId = number

export class Phantom {
  private static lastId: CreatureId = 0
  public static getId(): CreatureId {
    return this.lastId++
  }

  public pos: Point
  public refToReal?: Creature

  constructor(
    x: number,
    y: number,
    public id: CreatureId = Phantom.getId(),
  ) {
    this.pos = new Point(x, y)
  }

  public clone(): Phantom {
    return new Phantom(this.pos.x, this.pos.y, this.id)
  }

  public real(): Creature {
    return this.refToReal
  }
}

export abstract class Event {
  public abstract affect(actor: Creature): Reaction
}

export class Attack {
  constructor(public actor: Creature, public damage: number) {}

  public affect(subject: Creature): Reaction {
    if (this.damage > subject.health) {
      subject.currentLevel.logger.killMessage(this.damage, this.actor, subject)
      subject.die()
      return Reaction.HURT
    } else {
      subject.health -= this.damage
      subject.currentLevel.logger.hurtMessage(this.damage, this.actor, subject)
      return Reaction.DIE
    }
  }
}

export enum EventType {
  Attack,
}

export enum Reaction {
  DIE,
  HURT,
  NOTHING,
}

export class Creature extends Phantom {
  ai: AI
  public stageMemories: { [key: string]: Memory } = {}
  public previousPos: Point
  public currentLevel: LevelMap

  constructor(
    x: number,
    y: number,
    public health: number,
    public radius: number,
    ai: AI,
  ) {
    super(x, y)
    this.previousPos = this.pos.copy()
    this.ai = ai
  }

  public name(): string {
    return `${this.id}`
  }

  public addToMap(level: LevelMap) {
    this.currentLevel = level
    this.visionMask(level)
    level.addCreature(this)
  }

  public emit(eventType: EventType): Event {
    switch (eventType) {
    case EventType.Attack:
      return new Attack(this, Math.round(Math.random() * 5))
    default:
      throw `Unknow event type ${eventType} for ${this}`
    }
  }

  public die(): void {
    this.currentLevel.removeCreature(this)
  }

  public on(event: Event): Reaction {
    return event.affect(this)
  }

  public real(): Creature {
    return this
  }

  public stageMemory(levelId: LevelMapId = this.currentLevel.id): Memory {
    return this.stageMemories[levelId]
  }

  public act(stage: LevelMap): void {
    this.visionMask(stage)
    this.previousPos = this.pos.copy()
    this.ai.act(this, true)
    stage.at(this.previousPos.x, this.previousPos.y).creature = undefined
    stage.at(this.pos.x, this.pos.y).creature = this
  }

  public move(nextPoint: Point) {
    this.pos = nextPoint.copy()
  }

  public clone(): Phantom {
    let phantom = new Phantom(this.pos.x, this.pos.y, this.id)
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
      this.stageMemory().at(x, y).see(stage.at(x, y), degree)
    }

    new Fov(
      this.pos.x,
      this.pos.y,
      this.radius,
      stage.width,
      stage.height,
      this.isSolid(stage),
      see,
    ).calc()
  }

  private isSolid(stage: LevelMap): (x: number, y: number) => boolean {
    return (x: number, y: number) => {
      if (stage.visibleThrough(x, y)) {
        return false
      } else {
        return !(stage.at(x, y).isDoor() && this.pos.x === x && this.pos.y === y)
      }
    }
  }
}