import { twoDimArray } from '../utils'
// import { Stage, Type, TileType } from '../game'
import { AI, TileRecall } from '../ai'
import { Explorer } from '../ai/explorer'

import { Visibility, Fov } from '../fov'
import { LevelMap, Tile } from '../grid'

export class MemoryTile implements Visibility {
  public visible: boolean = false
  public degree: number = 0
  public seen: boolean = false
  public tangible: boolean = false

  constructor(
    private tile?: Tile,
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
      })
    })
  }
}

// TODO: Ensure seen is build before act() is called!
export class Walker {
  ai: AI
  // tile: Type
  public stageMemory: Memory

  constructor(public x: number, public y: number, private radius: number = 10, width, height) {
    // this.tile = new Type( TileType.humanoid )
    this.stageMemory = new Memory(width, height)
    this.ai = new Explorer()
  }

  act(stage: LevelMap): void {
    // this.stageMemory[ this.x ][ this.y ].updated = true

    this.visionMask( stage )
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
    }

    new Fov(
      this.x,
      this.y,
      this.radius,
      stage.width,
      stage.height,
      (x: number, y: number) => !stage.visibleThrough(x, y),
      see,
    ).calc()
  }
}
