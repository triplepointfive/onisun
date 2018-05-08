import { Point, twoDimArray } from './utils'
import { AI } from './ai'
import { Visibility } from './fov'

import { LevelMap, Tile } from './map'

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
        // tile.updated = tile.visible
        tile.visible = false
        tile.tile = undefined
      })
    })
  }
}

export abstract class Creature {
  ai: AI
  public stageMemory: Memory
  public previousPos: Point
  public x: number
  public y: number

  public move(nextPoint: Point) {
    this.x = nextPoint.x
    this.y = nextPoint.y
  }
}
