import { CreatureEvent } from './internal'
import { Creature, Reaction } from '../models/creature'
import { AddExperienceEvent } from './add_experience_event'
import { Item } from '../models/items'
import { Game } from '../models/game'
import { DieEvent } from './die_event'

export class ThrowEvent extends CreatureEvent {
  constructor(
    public actor: Creature,
    public missile: Item,
    private game: Game
  ) {
    super()
  }

  public affectCreature(subject: Creature): Reaction {
    if (this.actor.characteristics.throwMisses(subject.characteristics)) {
      this.game.logger.throwMissMessage(this.actor, subject, this.missile)
      return Reaction.THROW_DODGE
    }

    const damage = this.actor.characteristics.throwDamageTo(
      subject.characteristics,
      this.missile
    )

    if (damage >= subject.characteristics.health.currentValue()) {
      this.actor.on(new AddExperienceEvent(subject, this.game))
      this.game.logger.throwKillMessage(
        damage,
        this.actor,
        subject,
        this.missile
      )
      subject.on(new DieEvent())
      return Reaction.DIE
    } else {
      subject.characteristics.health.decrease(damage)
      this.game.logger.throwHurtMessage(
        damage,
        this.actor,
        subject,
        this.missile
      )
      return Reaction.HURT
    }
  }
}
