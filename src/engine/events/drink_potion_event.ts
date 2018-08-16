import { Potion } from '../items'

import { Game } from '../game'

import { Creature, Reaction } from '../creature'
import { CreatureEvent } from './internal'

export class DrinkPotionEvent extends CreatureEvent {
  constructor(private potion: Potion, private game: Game) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    actor.inventory.removeFromBag(this.potion, 1)
    this.potion.onDrink(this.game)
    // TODO: Different messages for player and creatures
    this.game.logger.drink(this.potion)
    return Reaction.NOTHING
  }
}
