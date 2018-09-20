import { Game, GroupedItem, ItemsBunch, Tile } from '../../engine'
import { Creature } from '../models/creature'
import { Player } from '../models/player'
import { Item } from '../models/item'
import { CreatureEvent, Reaction } from './internal'

export class PickUpItemsEvent extends CreatureEvent {
  constructor(
    private tile: Tile,
    private items: GroupedItem<Item>[],
    private game: Game
  ) {
    super()
  }

  public affectCreature(creature: Creature): Reaction {
    this.items.forEach(({ item, count }) => {
      creature.addItem(item, count)
    })

    return Reaction.NOTHING
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
