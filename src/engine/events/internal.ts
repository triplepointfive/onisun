import { Creature, Reaction, Player } from '../models/creature'
import { ImpactType } from '../lib/impact'

export abstract class CreatureEvent {
  public abstract affectCreature(subject: Creature): Reaction
  public affectPlayer(subject: Player): Reaction {
    return this.affectCreature(subject)
  }

  protected onStuffWeightChange(creature: Creature): void {
    creature.removeImpact(ImpactType.Overloaded, 'bag')
    creature.removeImpact(ImpactType.Stressed, 'bag')
    creature.removeImpact(ImpactType.Loaded, 'bag')

    if (
      creature.stuffWeight.current > creature.carryingCapacity.flattenedStart
    ) {
      // TODO: Die
    } else if (
      creature.stuffWeight.current > creature.carryingCapacity.overloadedStart
    ) {
      creature.addImpact(ImpactType.Overloaded, 'bag')
    } else if (
      creature.stuffWeight.current > creature.carryingCapacity.loadedStart
    ) {
      creature.addImpact(ImpactType.Loaded, 'bag')
    } else if (
      creature.stuffWeight.current > creature.carryingCapacity.stressed
    ) {
      creature.addImpact(ImpactType.Stressed, 'bag')
    }
  }
}
