import { InventorySlot, CreatureEvent, Game } from '../../engine'
import { Reaction, Creature } from '../models/creature'

export class TakeOffItemEvent extends CreatureEvent {
  constructor(private slot: InventorySlot, private game: Game) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    const groupedItem = this.slot.equipment

    if (groupedItem === undefined) {
      throw `Can not take off item from ${this.slot.name} - nothing equipped`
    }

    this.slot.takeOff(actor)
    this.game.logger.takeOff(groupedItem.item)

    return Reaction.NOTHING
  }
}
