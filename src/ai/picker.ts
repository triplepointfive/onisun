import { FollowTargetAI } from '../ai'
import { Creature, Ability } from '../creature'
import { Item, ItemId } from '../items'
import { Point } from '../utils'
import { AIItemPickedEvent } from './meta_ai'
import { InventoryItem } from '../engine'

export class Picker extends FollowTargetAI {
  private desiredItemId: ItemId = null

  public available(actor: Creature): boolean {
    return actor.can(Ability.Inventory) && super.available(actor)
  }

  protected foundNewTarget(actor: Creature): boolean {
    return (
      this.findItem(actor, item => item.id === this.desiredItemId) ||
      this.findItem(actor, item => true)
    )
  }

  protected onReach(actor: Creature): void {
    const tile = actor.currentLevel.at(actor.pos.x, actor.pos.y)
    this.prevAI.pushEvent(new AIItemPickedEvent(tile.items))

    tile.items.forEach(item => {
      actor.inventory.putToBag(new InventoryItem(1, item))
    })

    tile.items = []

    this.desiredItemId = null
  }

  private findItem(
    actor: Creature,
    condition: (item: Item) => boolean
  ): boolean {
    let result: boolean = false

    this.withinView(actor, ({ x, y }, tile) => {
      const item = tile.items().find(condition)

      if (item && !result) {
        this.desiredItemId = item.id
        this.destination = new Point(x, y)
        result = true
      }
    })

    return result
  }
}
