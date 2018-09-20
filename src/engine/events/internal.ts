import { Creature, Reaction } from '../models/creature'
import { Player } from '../models/player'

export abstract class PlayerEvent {
  public abstract affectPlayer(subject: Player): Reaction
}

export abstract class CreatureEvent extends PlayerEvent {
  public abstract affectCreature(subject: Creature): Reaction
  public affectPlayer(subject: Player): Reaction {
    return this.affectCreature(subject)
  }
}
