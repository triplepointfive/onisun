import { Point, twoDimArray } from '../utils'
import { AI, TileRecall } from '../ai'
import { Explorer } from '../ai/explorer'

import { Visibility, Fov } from '../fov'
import { LevelMap, Tile } from '../map'

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

// TODO: Ensure seen is build before act() is called!
export class Walker {
  ai: AI
  // tile: Type
  public stageMemory: Memory
  public previousPos: Point

  constructor(public x: number, public y: number, private radius: number = 10, width, height) {
    // this.tile = new Type( TileType.humanoid )
    this.stageMemory = new Memory(width, height)
    this.ai = new Explorer()
    this.previousPos = { x, y }
  }

  act(stage: LevelMap): void {
    // this.stageMemory[ this.x ][ this.y ].updated = true

    this.visionMask( stage )
    this.previousPos = { x: this.x, y: this.y }
    this.ai.act( this )

    // this.stageMemory[ this.x ][ this.y ].updated = true
  }

  private visionMask(stage: LevelMap): void {
    this.stageMemory.resetVisible()

    const see = (x: number, y: number, degree: number): void => {
      const tile = this.stageMemory.at(x, y)
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
