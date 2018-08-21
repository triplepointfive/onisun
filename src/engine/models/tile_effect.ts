import { Item } from './items'
import { Point } from '../utils/utils'
import { Memory } from './memory'

export abstract class TileEffect {
  constructor(public onDone: () => void) {}

  public abstract done(): boolean
  public abstract patchMemory(memory: Memory): void
  public speed(): number {
    return -1
  }
}

export class ItemFlightTileEffect extends TileEffect {
  constructor(
    public readonly item: Item,
    private frames: Point[],
    onDone: () => void
  ) {
    super(onDone)
  }

  public patchMemory(memory: Memory): void {
    if (this.done()) {
      return
    }

    const [point] = this.frames.splice(0, 1)
    const tile = memory.at(point.x, point.y)

    if (tile.visible) {
      tile.effect = '-'
    } else {
      // Skipping effect if it's not visible
      this.patchMemory(memory)
    }
  }

  public done(): boolean {
    return this.frames.length === 0
  }
}
