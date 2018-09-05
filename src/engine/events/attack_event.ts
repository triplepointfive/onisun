import { CreatureEvent } from './internal'
import { Creature, Reaction } from '../models/creature'
import { AddExperienceEvent } from './add_experience_event'
import { Game } from '../models/game'
import { LevelMap } from '../models/level_map'
import { Calculator } from '../lib/calculator'
import { HurtEvent } from './hurt_event'

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

    const hurtEvent = new HurtEvent(actor.damages, this.levelMap, this.game),
      reaction = this.victim.on(hurtEvent)

    switch (reaction) {
      case Reaction.DIE:
        actor.on(new AddExperienceEvent(this.victim, this.levelMap, this.game))
        this.game.logger.killMessage(hurtEvent.damage, actor, this.victim)
        break
      case Reaction.HURT:
        this.game.logger.hurtMessage(hurtEvent.damage, actor, this.victim)
        break
    }

    return reaction
  }
}
