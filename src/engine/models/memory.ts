import { Tile, Wall, TileVisitor } from './tile'
import { Creature, twoDimArray, ItemsBunch } from '../../engine'
import { Mapped } from '../utils/utils'
import { Item } from './item'

export class MemoryTile {
  public visible: boolean = false
  public degree: number = 0
  public seen: boolean = false
  public effect?: string

  constructor(public tile: Tile) {}

  get items(): ItemsBunch<Item> | undefined {
    return this.tile.items
  }

  get creature(): Creature | undefined {
    return this.tile.creature
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

  public reset(): void {
    this.visible = false
    this.effect = undefined
    this.tile.creature = undefined
  }

  public visit(tileVisitor: TileVisitor): void {
    this.tile.visit(tileVisitor)
  }
}

export class Memory extends Mapped<MemoryTile> {
  constructor(width: number, height: number) {
    const baseTile = new Wall()
    super(twoDimArray(width, height, () => new MemoryTile(baseTile)))
  }

  public resetVisible(): void {
    this.each(tile => tile.reset())
  }
}
