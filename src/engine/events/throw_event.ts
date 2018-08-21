import { CreatureEvent } from './internal'
import { Creature, Reaction } from '../models/creature'
import { AddExperienceEvent } from './add_experience_event'
import { Item } from '../models/items'

export class ThrowEvent extends CreatureEvent {
  constructor(public actor: Creature, public missile: Item) {
    super()
  }

  public affectCreature(subject: Creature): Reaction {
    let game = subject.currentLevel.game

    if (this.actor.characteristics.throwMisses(subject.characteristics)) {
      game.logger.throwMissMessage(this.actor, subject, this.missile)
      return Reaction.THROW_DODGE
    }

    const damage = this.actor.characteristics.throwDamageTo(
      subject.characteristics,
      this.missile
    )

    if (damage >= subject.characteristics.health.currentValue()) {
      this.actor.on(new AddExperienceEvent(subject, game))
      game.logger.throwKillMessage(damage, this.actor, subject, this.missile)
      subject.die()
      return Reaction.DIE
    } else {
      subject.characteristics.health.decrease(damage)
      game.logger.throwHurtMessage(damage, this.actor, subject, this.missile)
      return Reaction.HURT
    }
  }
}
