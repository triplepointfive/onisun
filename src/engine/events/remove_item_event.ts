import { CreatureEvent } from './internal'
import { Player, Reaction, Creature } from '../models/creature'
import { InventorySlot } from '../models/inventory_slot'
import { TakeOffItemEvent } from './take_off_item_event'
import { Game } from '../models/game'

export class RemoveItemEvent extends CreatureEvent {
  constructor(
    private slot: InventorySlot,
    private count: number,
    private game: Game
  ) {
    super()
  }

  public affectCreature(creature: Creature): Reaction {
    return Reaction.NOTHING
  }

  public affectPlayer(player: Player): Reaction {
    if (!this.slot.equipment) {
      throw `RemoveItemEvent: ${this.slot.name} has no equipment`
    }

    if (this.slot.equipment.count === this.count) {
      return player.on(new TakeOffItemEvent(this.slot, this.game))
    } else {
      this.slot.equipment.count -= this.count
    }

    return Reaction.NOTHING
  }
}
