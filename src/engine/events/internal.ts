import { Creature, Reaction } from '../models/creature'
import { Player } from '../models/player'

export abstract class CreatureEvent {
  public abstract affectCreature(subject: Creature): Reaction
  public affectPlayer(subject: Player): Reaction {
    return this.affectCreature(subject)
  }
}
