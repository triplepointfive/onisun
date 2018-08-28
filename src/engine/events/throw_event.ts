import { CreatureEvent } from './internal'
import { Creature, Reaction } from '../models/creature'
import { AddExperienceEvent } from './add_experience_event'
import { Item } from '../models/items'
import { Game } from '../models/game'
import { DieEvent, DieReason } from './die_event'
import { LevelMap } from '../../engine'

export class ThrowEvent extends CreatureEvent {
  constructor(
    public subject: Creature,
    public missile: Item,
    private levelMap: LevelMap,
    private game: Game
  ) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    if (this.subject.characteristics.throwMisses(actor.characteristics)) {
      this.game.logger.throwMissMessage(this.subject, actor, this.missile)
      return Reaction.THROW_DODGE
    }

    const damage = this.subject.characteristics.throwDamageTo(
      actor.characteristics,
      this.missile
    )

    if (damage >= actor.characteristics.health.currentValue()) {
      this.subject.on(new AddExperienceEvent(actor, this.game))
      this.game.logger.throwKillMessage(
        damage,
        this.subject,
        actor,
        this.missile
      )
      actor.on(new DieEvent(this.game, this.levelMap, DieReason.Missile))
      return Reaction.DIE
    } else {
      actor.characteristics.health.decrease(damage)
      this.game.logger.throwHurtMessage(
        damage,
        this.subject,
        actor,
        this.missile
      )
      return Reaction.HURT
    }
  }
}
