import { CreatureEvent } from './internal'
import { Creature, Reaction } from '../models/creature'
import { ImpactType, Game } from '../../engine'

export class RemoveImpactEvent extends CreatureEvent {
  constructor(
    private impactType: ImpactType,
    private source: string,
    private game: Game
  ) {
    super()
  }

  public affectCreature(creature: Creature): Reaction {
    return Reaction.NOTHING
  }
}
