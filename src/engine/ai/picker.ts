import { Item, ItemId, PickUpItemsEvent } from '../../engine'
import { Ability, Creature } from '../models/creature'
import { Game } from '../models/game'
import { Point } from '../utils/utils'
import { FollowTargetAI } from './internal'
import { AIItemPickedEvent } from './meta_ai'
import { CreatureEvent } from '../events/internal'

export class Picker extends FollowTargetAI {
  private desiredItemId: ItemId | undefined

  public act(actor: Creature, game: Game): CreatureEvent | undefined {
    if (actor.can(Ability.Inventory)) {
      return super.act(actor, game)
    }

    return
  }

  protected foundNewTarget(actor: Creature, game: Game): boolean {
    return (
      this.findItem(actor, game, item => item.id === this.desiredItemId) ||
      this.findItem(actor, game, item => true)
    )
  }

  protected onReach(actor: Creature, game: Game): CreatureEvent | undefined {
    const tile = game.currentMap.creatureTile(actor)

    if (!tile.items) {
      throw 'Picker.act : nothing to pick up'
    }

    actor.ai.pushEvent(new AIItemPickedEvent(tile.items, game))
    this.desiredItemId = undefined

    return new PickUpItemsEvent(tile, tile.items.bunch, game)
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
