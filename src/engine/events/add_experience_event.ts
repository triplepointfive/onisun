import { CreatureEvent } from './internal'
import { Creature, Reaction, Player } from '../models/creature'
import { Game, AINewLevelEvent } from '../../engine'

export class AddExperienceEvent extends CreatureEvent {
  constructor(public actor: Creature, private game: Game) {
    super()
  }

  public affectCreature(subject: Creature): Reaction {
    return Reaction.NOTHING
  }

  public affectPlayer(subject: Player): Reaction {
    subject.level.add(1).forEach(level => {
      subject.ai.pushEvent(new AINewLevelEvent(level, this.game))
    })

    return Reaction.NOTHING
  }
}
