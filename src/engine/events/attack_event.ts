import { CreatureEvent } from './internal'
import { Creature, Reaction } from '../models/creature'
import { AddExperienceEvent } from './add_experience_event'
import { Game } from '../models/game'
import { DieEvent, DieReason } from './die_event'

export class AttackEvent extends CreatureEvent {
  constructor(private subject: Creature, private game: Game) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    if (actor.characteristics.misses(this.subject.characteristics)) {
      this.game.logger.missMessage(actor, this.subject)
      return Reaction.DODGE
    }

    const damage = actor.characteristics.damageTo(this.subject.characteristics)

    if (damage >= this.subject.characteristics.health.currentValue()) {
      actor.on(new AddExperienceEvent(this.subject, this.game))
      this.game.logger.killMessage(damage, actor, this.subject)
      this.subject.on(
        new DieEvent(this.game, this.game.currentMap, DieReason.Attack)
      )
      return Reaction.DIE
    } else {
      this.subject.characteristics.health.decrease(damage)
      this.game.logger.hurtMessage(damage, actor, this.subject)
      return Reaction.HURT
    }
  }
}
