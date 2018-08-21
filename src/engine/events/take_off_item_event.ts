import { InventorySlot, CreatureEvent, Game } from '../../engine'
import { Reaction, Creature } from '../models/creature'

export class TakeOffItemEvent extends CreatureEvent {
  constructor(private slot: InventorySlot, private game: Game) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    // TODO: assert slot is not empty
    const groupedItem = this.slot.equipment
    this.slot.takeOff(actor)
    this.game.logger.takeOff(groupedItem.item)

    return Reaction.NOTHING
  }
}
