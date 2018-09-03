import { CreatureEvent } from './internal'
import { Creature, Reaction } from '../models/creature'

export class PlayerEvent extends CreatureEvent {
  public affectCreature(creature: Creature): Reaction {
    return Reaction.NOTHING
  }
}
