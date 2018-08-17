import { CreatureEvent } from './internal'
import { GroupedItem } from '../items'
import { Game } from '../game'
import { Tile } from '../../engine'
import { Creature, Reaction } from '../creature'

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
