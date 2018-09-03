import { CreatureEvent } from './internal'
import { Tile, GroupedItem, Game } from '../../engine'
import { Creature, Reaction } from '../models/creature'
import { Player } from '../models/player'
import { Item } from '../models/items'
import { PlayerEvent } from './player_event'

export class DropItemsEvent extends PlayerEvent {
  constructor(
    private tile: Tile,
    private items: GroupedItem<Item>[],
    private game: Game
  ) {
    super()
  }

  public affectPlayer(player: Player): Reaction {
    // TODO: Validate items are part of positions
    this.items.forEach(({ item, count }) => {
      player.removeItem(item, count)
      player.stuffWeight.subtract(item.weight * count)

      this.game.logger.droppedItem(item, count)
      this.tile.addItem(item, count)
    })

    return Reaction.NOTHING
  }
}
