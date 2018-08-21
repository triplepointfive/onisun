import { CreatureEvent } from './internal'
import { Tile, GroupedItem, Game } from '../../engine'
import { Reaction, Creature } from '../models/creature'

export class PickUpItemsEvent extends CreatureEvent {
  constructor(
    private tile: Tile,
    private items: GroupedItem[],
    private game: Game
  ) {
    super()
  }

  public affectCreature(subject: Creature): Reaction {
    let tileItems = this.tile.items

    this.items.forEach(({ item, count }) => {
      subject.inventory.putToBag(item, count)
      subject.stuffWeight.add(item.weight * count)

      this.game.logger.pickedUpItem(item, count)
      tileItems.remove(item, count)
    })

    return Reaction.NOTHING
  }
}
