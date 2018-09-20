import { Creature } from '../models/creature'
import { Player } from '../models/player'

export enum Reaction {
  DIE,
  HURT,
  DODGE,
  NOTHING,
  RESIST,
}

export abstract class PlayerEvent {
  public abstract affectPlayer(subject: Player): Reaction
}

export abstract class CreatureEvent extends PlayerEvent {
  public abstract affectCreature(subject: Creature): Reaction
  public affectPlayer(subject: Player): Reaction {
    return this.affectCreature(subject)
  }
}
