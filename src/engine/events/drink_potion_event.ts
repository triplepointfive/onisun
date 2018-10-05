import { Creature } from '../models/creature'
import { CreatureEvent, Reaction } from './internal'
import { Potion, Game } from '../../engine'

export class DrinkPotionEvent extends CreatureEvent {
  constructor(private potion: Potion, private game: Game) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    actor.removeItem(this.potion, 1)
    this.potion.onDrink(this.game)
    // TODO: Different messages for player and creatures
    this.game.logger.drink(this.potion)
    return Reaction.Nothing
  }
}
