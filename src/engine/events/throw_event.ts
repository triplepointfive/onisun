import { CreatureEvent } from './internal'
import { Creature, Reaction } from '../creature'
import { Item } from '../items'
import { AddExperienceEvent } from './add_experience_event'

export class ThrowEvent extends CreatureEvent {
  constructor(public actor: Creature, public missile: Item) {
    super()
  }

  public affectCreature(subject: Creature): Reaction {
    if (this.actor.characteristics.throwMisses(subject.characteristics)) {
      subject.currentLevel.game.logger.throwMissMessage(
        this.actor,
        subject,
        this.missile
      )
      return Reaction.THROW_DODGE
    }

    const damage = this.actor.characteristics.throwDamageTo(
      subject.characteristics,
      this.missile
    )

    if (damage >= subject.characteristics.health.currentValue()) {
      this.actor.on(new AddExperienceEvent(subject))
      subject.currentLevel.game.logger.throwKillMessage(
        damage,
        this.actor,
        subject,
        this.missile
      )
      subject.die()
      return Reaction.DIE
    } else {
      subject.characteristics.health.decrease(damage)
      subject.currentLevel.game.logger.throwHurtMessage(
        damage,
        this.actor,
        subject,
        this.missile
      )
      return Reaction.HURT
    }
  }
}
