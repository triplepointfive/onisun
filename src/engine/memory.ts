import { Tile, TileTypes } from './tile'
import { Creature, Phantom, twoDimArray } from '../engine'
import { ItemsBunch } from './items/internal'
import { Mapped } from './utils'

export class MemoryTile {
  public visible: boolean = false
  public degree: number = 0
  public seen: boolean = false
  public effect?: string

  constructor(public tile?: Tile) {}

  public see(tile: Tile, degree: number) {
    this.visible = true
    this.degree = degree
    this.seen = true
    this.tile = tile.clone()
  }

  public items(): ItemsBunch {
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
    this.effect = undefined
    this.tile.creature = undefined
  }
}

export class Memory extends Mapped<MemoryTile> {
  constructor(width: number, height: number) {
    const baseTile = new Tile('W', '#', TileTypes.Wall)
    super(twoDimArray(width, height, () => new MemoryTile(baseTile)))
  }

  public resetVisible(): void {
    this.each(tile => tile.reset())
  }
}
