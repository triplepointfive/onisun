import { AI } from '../ai'
import { Creature } from '../creature'
import { Item, ItemId } from '../items'
import { Point } from '../utils'
import { AIItemPickedEvent } from './meta_ai'

export class Picker extends AI {
  private desiredItemId: ItemId = null
  private desiredItemPos: Point = null

  public available(actor: Creature): boolean {
    return this.seesItem(actor)
  }

  public act(actor: Creature, firstTurn: boolean = true): void {
    if (!firstTurn) {
      throw 'Picker got called twice'
    }

    if (actor.pos.eq(this.desiredItemPos)) {
      const tile = actor.currentLevel.at(actor.pos.x, actor.pos.y)
      this.prevAI.pushEvent(new AIItemPickedEvent(tile.items))

      tile.items.forEach(item => {
        actor.inventory.putToBag(item)
      })

      tile.items = []

      this.desiredItemId = null
      this.desiredItemPos = null

      return
    }

    this.moveTo(actor, this.desiredItemPos)
  }

  protected canTakeMore(actor: Creature): boolean {
    // TODO:
    return true
  }

  protected seesItem(actor: Creature): boolean {
    this.findItem(actor, item => item.id === this.desiredItemId)

    if (this.desiredItemId !== null) {
      return true
    }
    this.desiredItemId = null
    this.desiredItemPos = null

    this.findItem(actor, item => true)

    return this.desiredItemId !== null
  }

  private findItem(
    actor: Creature,
    condition: (item: Item) => boolean
  ): boolean {
    this.withinView(actor, ({ x, y }, tile) => {
      const items = tile.items()
      const item = items.find(condition)

      if (item) {
        this.desiredItemId = item.id
        this.desiredItemPos = new Point(x, y)
        return true
      }
    })

    return false
  }
}
