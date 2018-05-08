import { Point, twoDimArray } from './utils'
import { AI } from './ai'
import { Visibility, Fov } from './fov'

import { LevelMap, LevelMapId, Tile } from './map'

export class MemoryTile implements Visibility {
  public visible: boolean = false
  public degree: number = 0
  public seen: boolean = false
  public tangible: boolean = false

  constructor(
    public tile?: Tile,
    ) {
  }
}

export class Memory {
  public field: MemoryTile[][]

  constructor(
    public width: number,
    public height: number,
    baseBlock: (() => MemoryTile) = () => new MemoryTile(),
    ) {
    this.field = twoDimArray(height, width, baseBlock)
  }

  at(x: number, y: number): MemoryTile {
    return this.field[y][x]
  }

  public resetVisible(): void {
    this.field.forEach((row) => {
      row.forEach((tile) => {
        tile.visible = false
        tile.tile = undefined
      })
    })
  }
}

export abstract class Creature {
  ai: AI
  public stageMemories: { [key: string]: Memory } = {}
  public previousPos: Point
  private currentLevelId: LevelMapId

  constructor(
    public x: number,
    public y: number,
    public radius: number,
    level: LevelMap,
  ) {
    this.previousPos = { x, y }
    this.currentLevelId = level.id
    this.visionMask(level)
  }

  public stageMemory(levelId: LevelMapId = this.currentLevelId): Memory {
    return this.stageMemories[levelId]
  }

  public act(stage: LevelMap): void {
    this.visionMask(stage)
    this.previousPos = { x: this.x, y: this.y }
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
      const tile = this.stageMemory().at(x, y)
      tile.visible = true
      tile.degree = degree
      tile.seen = true
      tile.tangible = !stage.passibleThrough(x, y)
      tile.tile = stage.at(x, y)
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
