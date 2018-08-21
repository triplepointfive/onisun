import { CreatureEvent } from './internal'
import { Tile, GroupedItem, Game } from '../../engine'
import { Creature, Reaction } from '../models/creature'

export class DropItemsEvent extends CreatureEvent {
  constructor(
    private tile: Tile,
    private items: GroupedItem[],
    private game: Game
  ) {
    super()
  }

  public affectCreature(subject: Creature): Reaction {
    // TODO: Validate items are part of positions
    this.items.forEach(({ item, count }) => {
      subject.inventory.removeFromBag(item, count)
      this.game.logger.droppedItem(item, count)
      this.tile.addItem(item, count)
    })

    return Reaction.NOTHING
  }
}
