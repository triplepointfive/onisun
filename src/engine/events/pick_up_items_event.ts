import { CreatureEvent } from './internal'
import { Tile, GroupedItem, Game, ItemsBunch } from '../../engine'
import { Reaction, Creature } from '../models/creature'
import { Item } from '../models/items'

export class PickUpItemsEvent extends CreatureEvent {
  constructor(
    private tile: Tile,
    private items: GroupedItem<Item>[],
    private game: Game
  ) {
    super()
  }

  public affectCreature(subject: Creature): Reaction {
    let tileItems: ItemsBunch<Item> | undefined = this.tile.items

    if (tileItems === undefined) {
      throw 'Failed to pick up items - tile has no items'
    } else {
      this.withTileItems(subject, tileItems)
    }

    return Reaction.NOTHING
  }

  protected withTileItems(subject: Creature, tileItems: ItemsBunch<Item>) {
    this.items.forEach(({ item, count }) => {
      subject.inventory.putToBag(item, count)
      subject.stuffWeight.add(item.weight * count)

      this.game.logger.pickedUpItem(item, count)
      tileItems.remove(item, count)
    })
  }
}
