import { CreatureEvent } from './internal'
import { Reaction, Creature } from '../models/creature'

export class StayEvent extends CreatureEvent {
  public affectCreature(creature: Creature): Reaction {
    return Reaction.NOTHING
  }
}
