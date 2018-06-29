import { Item } from './items/internal'
import { Point } from './utils'
import { Memory } from './memory'

export abstract class Effect {
  public abstract done(): boolean
  public abstract patchMemory(memory: Memory): void
  public speed(): number {
    return -1
  }
}

export class ItemFlightEffect extends Effect {
  constructor(public readonly item: Item, private frames: Point[]) {
    super()
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
