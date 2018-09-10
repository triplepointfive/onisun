import { Game, GroupedItem, ItemsBunch, Tile } from '../../engine'
import { Creature, Reaction } from '../models/creature'
import { Player } from '../models/player'
import { Item } from '../models/item'
import { PlayerEvent } from './player_event'

export class PickUpItemsEvent extends PlayerEvent {
  constructor(
    private tile: Tile,
    private items: GroupedItem<Item>[],
    private game: Game
  ) {
    super()
  }

  public affectPlayer(player: Player): Reaction {
    let tileItems: ItemsBunch<Item> | undefined = this.tile.items

    if (tileItems === undefined) {
      throw 'Failed to pick up items - tile has no items'
    } else {
      this.withTileItems(player, tileItems)
    }

    return Reaction.NOTHING
  }

  protected withTileItems(subject: Player, tileItems: ItemsBunch<Item>) {
    this.items.forEach(({ item, count }) => {
      subject.addItem(item, count)
      subject.stuffWeight.add(item.weight * count)

      this.game.logger.pickedUpItem(item, count)
      tileItems.remove(item, count)
    })
  }
}
