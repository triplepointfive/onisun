import { CreatureEvent } from './internal'
import { Creature, Reaction } from '../creature'
import { AddExperienceEvent } from './add_experience_event'

export class AttackEvent extends CreatureEvent {
  constructor(public actor: Creature) {
    super()
  }

  public affectCreature(subject: Creature): Reaction {
    if (this.actor.characteristics.misses(subject.characteristics)) {
      subject.currentLevel.game.logger.missMessage(this.actor, subject)
      return Reaction.DODGE
    }

    const damage = this.actor.characteristics.damageTo(subject.characteristics)

    if (damage >= subject.characteristics.health.currentValue()) {
      this.actor.on(new AddExperienceEvent(subject))
      subject.currentLevel.game.logger.killMessage(damage, this.actor, subject)
      subject.die()
      return Reaction.DIE
    } else {
      subject.characteristics.health.decrease(damage)
      subject.currentLevel.game.logger.hurtMessage(damage, this.actor, subject)
      return Reaction.HURT
    }
  }
}
