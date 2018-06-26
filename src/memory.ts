import { Tile } from './tile';
import { Item } from './items';
import { Creature, Phantom, Mapped, twoDimArray } from './onisun';

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
    const baseTile = Tile.retrieve('W')
    super(twoDimArray(width, height, () => new MemoryTile(baseTile)))
  }

  public resetVisible(): void {
    this.each(tile => tile.reset())
  }
}
