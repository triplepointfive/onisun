import { CreatureEvent } from './internal'
import { Creature, Reaction } from '../models/creature'
import { AddExperienceEvent } from './add_experience_event'
import { Game } from '../models/game'
import { DieEvent, DieReason } from './die_event'
import { LevelMap } from '../models/level_map'
import { Calculator } from '../lib/calculator'

export class AttackEvent extends CreatureEvent {
  constructor(
    private subject: Creature,
    private levelMap: LevelMap,
    private game: Game
  ) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    if (actor.characteristics.misses(this.subject.characteristics)) {
      this.game.logger.missMessage(actor, this.subject)
      return Reaction.DODGE
    }

    const damage = Calculator.damage(actor.damages, this.subject.protections)

    if (damage >= this.subject.health.currentValue) {
      actor.on(new AddExperienceEvent(this.subject, this.levelMap, this.game))
      this.game.logger.killMessage(damage, actor, this.subject)
      this.subject.on(new DieEvent(this.game, this.levelMap, DieReason.Attack))
      return Reaction.DIE
    } else {
      this.subject.health.decrease(damage)
      this.game.logger.hurtMessage(damage, actor, this.subject)
      return Reaction.HURT
    }
  }
}
