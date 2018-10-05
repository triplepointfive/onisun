import { CreatureEvent, Reaction } from './internal'
import { Tile, GroupedItem, Game } from '../../engine'
import { Creature } from '../models/creature'
import { Player } from '../models/player'
import { Item } from '../models/item'

export class DropItemsEvent extends CreatureEvent {
  constructor(
    private tile: Tile,
    private items: GroupedItem<Item>[],
    private game: Game
  ) {
    super()
  }

  public affectCreature(creature: Creature): Reaction {
    this.items.forEach(({ item, count }) => {
      creature.removeItem(item, count)
    })

    return Reaction.Nothing
  }

  public affectPlayer(player: Player): Reaction {
    // TODO: Validate items are part of positions
    this.items.forEach(({ item, count }) => {
      player.removeItem(item, count)
      player.stuffWeight.subtract(item.weight * count)

      this.game.logger.droppedItem(item, count)
      this.tile.addItem(item, count)
    })

    return Reaction.Nothing
  }
}
