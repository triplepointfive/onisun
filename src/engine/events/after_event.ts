import { CreatureEvent } from './internal'
import { Reaction, Creature } from '../models/creature'
import { LevelMap, Game, ImpactType, DieEvent, DieReason } from '../../engine'

export class AfterEvent extends CreatureEvent {
  constructor(private levelMap: LevelMap, private game: Game) {
    super()
  }

  public affectCreature(creature: Creature): Reaction {
    creature.removeImpact(ImpactType.Overloaded, 'bag')
    creature.removeImpact(ImpactType.Stressed, 'bag')
    creature.removeImpact(ImpactType.Loaded, 'bag')

    if (
      creature.stuffWeight.current > creature.carryingCapacity.flattenedStart
    ) {
      return creature.on(
        new DieEvent(this.game, this.levelMap, DieReason.Overloaded)
      )
    }

    if (
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

    return Reaction.NOTHING
  }
}
