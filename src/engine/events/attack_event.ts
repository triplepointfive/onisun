import { CreatureEvent, Reaction } from './internal'
import { Creature } from '../models/creature'
import { AddExperienceEvent } from './add_experience_event'
import { Game } from '../models/game'
import { LevelMap } from '../models/level_map'
import { Calculator } from '../lib/calculator'
import { HurtEvent } from './hurt_event'
import { DieReason } from './die_event'
import { Player } from '../models/player'

export class AttackEvent extends CreatureEvent {
  constructor(
    private victim: Creature,
    private levelMap: LevelMap,
    private game: Game
  ) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    return this.process(actor, false)
  }

  public affectPlayer(player: Player): Reaction {
    const reaction = this.process(player, true)

    if (reaction === Reaction.DIE) {
      player.on(new AddExperienceEvent(this.victim, this.levelMap, this.game))
    }

    return reaction
  }

  protected process(actor: Creature, isPlayer: boolean): Reaction {
    const [reaction, damage] = this.hit(actor)

    this.game.logger.attackLogger.melee(
      damage,
      actor,
      this.victim,
      reaction,
      isPlayer
    )

    return reaction
  }

  protected hit(actor: Creature): [Reaction, number] {
    if (Calculator.misses(actor.bodyControl, this.victim.bodyControl)) {
      return [Reaction.DODGE, 0]
    }

    const hurtEvent = new HurtEvent(
      Calculator.withCritical(actor.damages, actor.specie.critical),
      DieReason.Attack,
      this.levelMap,
      this.game
    )

    return [this.victim.on(hurtEvent), hurtEvent.damage]
  }
}
