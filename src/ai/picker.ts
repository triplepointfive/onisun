import { FollowTargetAI } from '../ai'
import { Creature, Ability } from '../creature'
import { Item, ItemId } from '../items'
import { Point } from '../utils'
import { AIItemPickedEvent } from './meta_ai'

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

    tile.items.bunch.forEach(groupedItem => {
      actor.inventory.putToBag(groupedItem.item, groupedItem.count)
    })

    tile.items = undefined

    this.desiredItemId = null
  }

  private findItem(
    actor: Creature,
    condition: (item: Item) => boolean
  ): boolean {
    let result: boolean = false

    this.withinView(actor, ({ x, y }, tile) => {
      if (!tile.items()) {
        return
      }

      const item = tile.items().bunch.find(groupedItem => condition(groupedItem.item))

      if (item && !result) {
        this.desiredItemId = item.id
        this.destination = new Point(x, y)
        result = true
      }
    })

    return result
  }
}
