import { ImpactType } from '../lib/impact'
import { Creature, Reaction } from '../models/creature'
import { Game } from '../models/game'
import { CreatureEvent } from './internal'

export class AddImpactEvent extends CreatureEvent {
  constructor(
    private impactType: ImpactType,
    private source: string,
    private game: Game,
    private duration?: number
  ) {
    super()
  }

  public affectCreature(creature: Creature): Reaction {
    // Different messages for player
    if (this.duration) {
      creature.addImpact(this.impactType, this.duration)
    } else {
      creature.addConstImpact(this.impactType, this.source)
    }

    return Reaction.NOTHING
  }
}
