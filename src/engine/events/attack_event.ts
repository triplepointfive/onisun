import { CreatureEvent } from './internal'
import { Creature, Reaction } from '../models/creature'
import { AddExperienceEvent } from './add_experience_event'
import { Game } from '../models/game'
import { DieEvent } from './die_event'

export class AttackEvent extends CreatureEvent {
  constructor(public actor: Creature, private game: Game) {
    super()
  }

  public affectCreature(subject: Creature): Reaction {
    if (this.actor.characteristics.misses(subject.characteristics)) {
      this.game.logger.missMessage(this.actor, subject)
      return Reaction.DODGE
    }

    const damage = this.actor.characteristics.damageTo(subject.characteristics)

    if (damage >= subject.characteristics.health.currentValue()) {
      this.actor.on(new AddExperienceEvent(subject, this.game))
      this.game.logger.killMessage(damage, this.actor, subject)
      subject.on(new DieEvent())
      return Reaction.DIE
    } else {
      subject.characteristics.health.decrease(damage)
      this.game.logger.hurtMessage(damage, this.actor, subject)
      return Reaction.HURT
    }
  }
}
