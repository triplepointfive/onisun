import { InventorySlot, CreatureEvent, Game } from '../../engine'
import { Reaction, Creature, Player } from '../models/creature'

export class TakeOffItemEvent extends CreatureEvent {
  constructor(private slot: InventorySlot, private game: Game) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    return Reaction.NOTHING
  }

  public affectPlayer(player: Player): Reaction {
    const groupedItem = this.slot.equipment

    if (groupedItem === undefined) {
      throw `Can not take off item from ${this.slot.name} - nothing equipped`
    }

    this.slot.takeOff(player)
    this.game.logger.takeOff(groupedItem.item)

    return Reaction.NOTHING
  }
}
