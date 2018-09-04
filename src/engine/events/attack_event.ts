import { CreatureEvent } from './internal'
import { Creature, Reaction } from '../models/creature'
import { AddExperienceEvent } from './add_experience_event'
import { Game } from '../models/game'
import { DieEvent, DieReason } from './die_event'
import { LevelMap } from '../models/level_map'
import { Calculator } from '../lib/calculator'
import { Damage } from '../lib/damage'
import { Resistance } from '../models/specie'

export class AttackEvent extends CreatureEvent {
  constructor(
    private subject: Creature,
    private levelMap: LevelMap,
    private game: Game
  ) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    const reaction = this.process(actor)

    switch (reaction) {
      case Reaction.NOTHING:
        // TODO: victim is not always a player, should be another message as well
        this.game.logger.noDamageToPlayer(actor)
        break
      case Reaction.NOTHING:
        // TODO: victim is not always a player, should be another message as well
        this.game.logger.playerIgnoresDamage(actor)
        break
    }

    return reaction
  }

  public affectPlayer(actor: Creature): Reaction {
    const reaction = this.process(actor)

    switch (reaction) {
      case Reaction.NOTHING:
        this.game.logger.noDamageToTarget(actor)
        break
      case Reaction.RESIST:
        this.game.logger.targetIgnoresDamage(this.subject)
        break
    }

    return reaction
  }

  protected process(actor: Creature): Reaction {
    // if (Calculator.misses(actor.characteristics.misses(this.subject.characteristics)) {
    // TODO: Add actual check
    if (Calculator.misses(10, 10)) {
      this.game.logger.missMessage(actor, this.subject)
      return Reaction.DODGE
    }

    const { damage, resist } = Calculator.damage(
      actor.damages,
      this.subject.protections,
      this.subject.resistances
    )

    if (resist) {
      return Reaction.RESIST
    }

    if (damage >= this.subject.health.currentValue) {
      actor.on(new AddExperienceEvent(this.subject, this.levelMap, this.game))
      this.game.logger.killMessage(damage, actor, this.subject)
      this.subject.on(new DieEvent(this.game, this.levelMap, DieReason.Attack))
      return Reaction.DIE
    } else if (damage <= 0) {
      return Reaction.NOTHING
    } else {
      this.subject.health.decrease(damage)
      this.game.logger.hurtMessage(damage, actor, this.subject)
      return Reaction.HURT
    }
  }
}
