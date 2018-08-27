import { Item, ItemId } from '../../engine'
import { Ability, Creature } from '../models/creature'
import { Game } from '../models/game'
import { Point } from '../utils/utils'
import { FollowTargetAI } from './internal'
import { AIItemPickedEvent } from './meta_ai'
import { GroupedItem } from '../models/items'

export class Picker extends FollowTargetAI {
  private desiredItemId: ItemId | undefined

  public available(actor: Creature, game: Game): boolean {
    return actor.can(Ability.Inventory) && super.available(actor, game)
  }

  protected foundNewTarget(actor: Creature, game: Game): boolean {
    return (
      this.findItem(actor, game, item => item.id === this.desiredItemId) ||
      this.findItem(actor, game, item => true)
    )
  }

  protected onReach(actor: Creature, game: Game): void {
    const tile = game.currentMap.creatureTile(actor)

    if (!tile.items) {
      throw 'Picker.act : nothing to pick up'
    }

    if (this.prevAI) {
      this.prevAI.pushEvent(new AIItemPickedEvent(tile.items, game))
    }

    tile.items.bunch.forEach((groupedItem: GroupedItem) => {
      actor.inventory.putToBag(groupedItem.item, groupedItem.count)
    })

    tile.items = undefined

    this.desiredItemId = undefined
  }

  private findItem(
    actor: Creature,
    game: Game,
    condition: (item: Item) => boolean
  ): boolean {
    const memory = actor.stageMemory(game.currentMap)
    let result: boolean = false

    this.withinView(
      memory,
      game.currentMap.creaturePos(actor),
      ({ x, y }, tile) => {
        if (!tile.items) {
          return
        }

        const item = tile.items.bunch.find(groupedItem =>
          condition(groupedItem.item)
        )

        if (item && !result) {
          this.desiredItemId = item.item.id
          this.destination = new Point(x, y)
          result = true
        }
      }
    )

    return result
  }
}
