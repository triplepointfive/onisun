import { CreatureEvent } from './internal'
import { Creature, Reaction } from '../models/creature'
import { AddExperienceEvent } from './add_experience_event'
import { Game } from '../models/game'
import { DieEvent, DieReason } from './die_event'
import { LevelMap } from '../models/level_map'
import { Calculator } from '../lib/calculator'

export class AttackEvent extends CreatureEvent {
  constructor(
    private victim: Creature,
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
      case Reaction.RESIST:
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
        this.game.logger.targetIgnoresDamage(this.victim)
        break
    }

    return reaction
  }

  protected process(actor: Creature): Reaction {
    if (Calculator.misses(actor.bodyControl, this.victim.bodyControl)) {
      this.game.logger.missMessage(actor, this.victim)
      return Reaction.DODGE
    }

    const { damage, resist } = Calculator.damage(
      actor.damages,
      this.victim.protections,
      this.victim.resistances
    )

    if (resist) {
      return Reaction.RESIST
    }

    if (damage >= this.victim.health.currentValue) {
      actor.on(new AddExperienceEvent(this.victim, this.levelMap, this.game))
      this.game.logger.killMessage(damage, actor, this.victim)
      this.victim.on(new DieEvent(this.game, this.levelMap, DieReason.Attack))
      return Reaction.DIE
    } else if (damage <= 0) {
      return Reaction.NOTHING
    } else {
      this.victim.health.decrease(damage)
      this.game.logger.hurtMessage(damage, actor, this.victim)
      return Reaction.HURT
    }
  }
}
