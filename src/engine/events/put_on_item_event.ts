import { CreatureEvent } from './internal'
import { InventorySlot, Item, Game } from '../../engine'
import { Creature, Reaction, Player } from '../models/creature'

export class PutOnItemEvent extends CreatureEvent {
  constructor(
    private slot: InventorySlot,
    private item: Item,
    private game: Game
  ) {
    super()
  }

  public affectCreature(creature: Creature): Reaction {
    return Reaction.NOTHING
  }

  public affectPlayer(player: Player): Reaction {
    this.slot.equip(player, this.item)
    this.game.logger.putOn(this.item)

    return Reaction.NOTHING
  }
}
