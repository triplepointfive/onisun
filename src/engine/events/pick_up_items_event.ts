import { CreatureEvent } from './internal'
import { Tile, GroupedItem, Game } from '../../engine'
import { Reaction, Creature } from '../models/creature'
import { ItemsBunch } from '../models/items'

export class PickUpItemsEvent extends CreatureEvent {
  constructor(
    private tile: Tile,
    private items: GroupedItem[],
    private game: Game
  ) {
    super()
  }

  public affectCreature(subject: Creature): Reaction {
    let tileItems: ItemsBunch | undefined = this.tile.items

    if (tileItems === undefined) {
      throw 'Failed to pick up items - tile has no items'
    } else {
      this.withTileItems(subject, tileItems)
    }

    return Reaction.NOTHING
  }

  protected withTileItems(subject: Creature, tileItems: ItemsBunch) {
    this.items.forEach(({ item, count }) => {
      subject.inventory.putToBag(item, count)
      subject.stuffWeight.add(item.weight * count)

      this.game.logger.pickedUpItem(item, count)
      tileItems.remove(item, count)
    })
    this.onStuffWeightChange(subject)
  }
}
