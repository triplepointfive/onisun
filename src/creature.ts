import { Point, twoDimArray } from './utils'
import { AI } from './ai'
import { Fov } from './fov'

import { LevelMap, LevelMapId, Tile } from './map'

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

  public tangible(): boolean {
    return this.seen && !this.tile.passibleThrough()
  }

  public reset(): void {
    this.visible = false
    this.tile.creature = undefined
  }
}

export class Memory {
  public field: MemoryTile[][]

  constructor(
    public width: number,
    public height: number,
  ) {
    const baseTile = Tile.retrive('W')
    this.field = twoDimArray(height, width, () => new MemoryTile(baseTile))
  }

  at(x: number, y: number): MemoryTile {
    return this.field[y][x]
  }

  public resetVisible(): void {
    this.field.forEach((row) => {
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

  constructor(
    public x: number,
    public y: number,
    public id: CreatureId = Phantom.getId(),
  ) {
  }

  public clone(): Phantom {
    return new Phantom(this.x, this.y, this.id)
  }
}

export abstract class Creature extends Phantom {
  ai: AI
  public stageMemories: { [key: string]: Memory } = {}
  public previousPos: Point
  private currentLevelId: LevelMapId

  constructor(
    x: number,
    y: number,
    public radius: number,
    level: LevelMap,
  ) {
    super(x, y)
    this.previousPos = new Point(x, y)
    this.currentLevelId = level.id
    this.visionMask(level)
    level.addCreature(this)
  }

  public stageMemory(levelId: LevelMapId = this.currentLevelId): Memory {
    return this.stageMemories[levelId]
  }

  public act(stage: LevelMap): void {
    this.visionMask(stage)
    this.previousPos = new Point(this.x, this.y)
    this.ai.act(this)
    stage.at(this.previousPos.x, this.previousPos.y).creature = undefined
    stage.at(this.x, this.y).creature = this
    this.visionMask(stage)
  }

  public move(nextPoint: Point) {
    this.x = nextPoint.x
    this.y = nextPoint.y
  }

  protected visionMask(stage: LevelMap): void {
    if (!this.stageMemories[stage.id]) {
      this.stageMemories[stage.id] = new Memory(stage.width, stage.height)
    } else {
      this.stageMemory().resetVisible()
    }

    const see = (x: number, y: number, degree: number): void => {
      this.stageMemory().at(x, y).see(stage.at(x, y), degree)
    }

    new Fov(
      this.x,
      this.y,
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
        return !(stage.at(x, y).isDoor() && this.x === x && this.y === y)
      }
    }
  }
}
