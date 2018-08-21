import { Creature, Reaction, Player } from '../models/creature'

export abstract class CreatureEvent {
  public abstract affectCreature(subject: Creature): Reaction
  public affectPlayer(subject: Player): Reaction {
    return this.affectCreature(subject)
  }
}
