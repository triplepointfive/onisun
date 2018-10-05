import { CreatureEvent, Reaction } from './internal'
import { Creature } from '../models/creature'
import { ImpactType, Game } from '../../engine'

export class RemoveImpactEvent extends CreatureEvent {
  constructor(
    private impactType: ImpactType,
    private game: Game,
    private source: string | undefined = undefined
  ) {
    super()
  }

  public affectCreature(creature: Creature): Reaction {
    // Different messages for player
    if (this.source) {
      creature.removeConstImpact(this.impactType, this.source)
    } else {
      creature.removeImpact(this.impactType)
    }

    return Reaction.Nothing
  }
}
