import { Mapped, Point, twoDimArray } from './utils'
import { AI } from './ai'
import { Fov } from './fov'
import { Item, Equipment } from './items'

import { LevelMap, LevelMapId, Tile } from './map'
import { Inventory, BodyPart } from './inventory'

import { Characteristics } from './onisun'

export class MemoryTile {
  public visible: boolean = false
  public degree: number = 0
  public seen: boolean = false

  constructor(public tile?: Tile) {}

  public see(tile: Tile, degree: number) {
    this.visible = true
    this.degree = degree
    this.seen = true
    this.tile = tile.clone()
  }

  public items(): Item[] {
    return this.tile.items
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
  constructor(width: number, height: number) {
    const baseTile = Tile.retrive('W')
    super(twoDimArray(height, width, () => new MemoryTile(baseTile)))
  }

  public inRange(point: Point): boolean {
    return (
      point.x >= 0 &&
      point.y >= 0 &&
      point.x < this.width &&
      point.y < this.height
    )
  }

  public resetVisible(): void {
    this.map.forEach(row => {
      row.forEach(tile => {
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
    public clan: Clan,
    public id: CreatureId = Phantom.getId()
  ) {
    this.pos = new Point(x, y)
  }

  public clone(): Phantom {
    return new Phantom(this.pos.x, this.pos.y, this.clan, this.id)
  }

  public real(): Creature {
    return this.refToReal
  }
}

export abstract class Event {
  public abstract affect(actor: Creature): Reaction
}

export class Attack {
  constructor(public actor: Creature) {}

  public affect(subject: Creature): Reaction {
    const damage = this.actor.characteristics.damageTo(subject.characteristics)

    if (damage >= subject.characteristics.health.currentValue()) {
      subject.currentLevel.logger.killMessage(damage, this.actor, subject)
      subject.die()
      return Reaction.DIE
    } else {
      subject.characteristics.health.decrease(damage)
      subject.currentLevel.logger.hurtMessage(damage, this.actor, subject)
      return Reaction.HURT
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

export enum Clan {
  Player,
  PlayerOnlyEnemy,
  FreeForAll,
}

export class Creature extends Phantom {
  ai: AI
  public stageMemories: { [key: string]: Memory } = {}
  public previousPos: Point
  public currentLevel: LevelMap
  public inventory: Inventory
  public characteristics: Characteristics

  constructor(
    x: number,
    y: number,
    attack: number,
    defense: number,
    health: number,
    radius: number,
    speed: number,
    clan: Clan,
    ai: AI
  ) {
    super(x, y, clan)
    this.previousPos = this.pos.copy()
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
    this.characteristics = new Characteristics(attack, defense, health, radius, speed)
  }

  public putOn(item: Equipment) {
    this.inventory.equip(item)
    item.onPutOn(this)
  }

  public takeOff(item: Equipment) {
    this.inventory.equip(item)
    item.onPutOn(this)
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
        return new Attack(this)
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
    stage.at(this.previousPos.x, this.previousPos.y).creature = undefined
    stage.at(this.pos.x, this.pos.y).creature = this
  }

  public move(nextPoint: Point) {
    this.pos = nextPoint.copy()
  }

  public clone(): Phantom {
    let phantom = new Phantom(this.pos.x, this.pos.y, this.clan, this.id)
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
