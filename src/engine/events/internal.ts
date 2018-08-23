import { Creature, Reaction, Player } from '../models/creature'

export abstract class CreatureEvent {
  public abstract affectCreature(subject: Creature): Reaction
  public affectPlayer(subject: Player): Reaction {
    return this.affectCreature(subject)
  }

  protected onStuffWeightChange(creature: Creature): void {
    // TODO: Remove all effects just in case

    if (creature.stuffWeight.current > creature.carryingCapacity.flattenedStart) {
      // TODO: Die
    } else if (creature.stuffWeight.current > creature.carryingCapacity.overloadedStart) {

    } else if (creature.stuffWeight.current > creature.carryingCapacity.loadedStart) {

    } else if (creature.stuffWeight.current > creature.carryingCapacity.stressed) {

    }
  }
}
