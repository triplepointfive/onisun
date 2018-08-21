import { CreatureEvent } from './internal'
import { InventorySlot, Item, Game } from '../../engine'
import { Creature, Reaction } from '../models/creature'

export class PutOnItemEvent extends CreatureEvent {
  constructor(
    private slot: InventorySlot,
    private item: Item,
    private game: Game
  ) {
    super()
  }

  public affectCreature(creature: Creature): Reaction {
    this.slot.equip(creature, this.item)
    this.game.logger.putOn(this.item)

    return Reaction.NOTHING
  }
}
