import { CreatureEvent } from './internal'
import { Creature, Reaction, Player } from '../creature'
import { AINewLevelEvent } from '../ai'

export class AddExperienceEvent extends CreatureEvent {
  constructor(public actor: Creature) {
    super()
  }

  public affectCreature(subject: Creature): Reaction {
    return Reaction.NOTHING
  }

  public affectPlayer(subject: Player): Reaction {
    subject.level.add(1).forEach(level => {
      subject.ai.pushEvent(
        new AINewLevelEvent(level, subject.currentLevel.game)
      )
    })

    return Reaction.NOTHING
  }
}
