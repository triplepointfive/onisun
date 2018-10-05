import { HurtEvent, LevelMap, Player } from '../../engine'
import { Calculator } from '../lib/calculator'
import { Creature } from '../models/creature'
import { Game } from '../models/game'
import { Item } from '../models/item'
import { AddExperienceEvent } from './add_experience_event'
import { DieReason } from './die_event'
import { CreatureEvent, Reaction } from './internal'

export class ThrowEvent extends CreatureEvent {
  constructor(
    public victim: Creature,
    public missile: Item,
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

    if (reaction === Reaction.Die) {
      player.killStat.add(this.victim.name)
      player.on(new AddExperienceEvent(this.victim, this.levelMap, this.game))
    }

    return reaction
  }

  protected process(actor: Creature, isPlayer: boolean): Reaction {
    const [reaction, damage] = this.throw(actor)

    this.game.logger.attackLogger.missile(
      damage,
      actor,
      this.victim,
      reaction,
      this.missile,
      isPlayer
    )

    return reaction
  }

  protected throw(actor: Creature): [Reaction, number] {
    if (Calculator.misses(actor.bodyControl, this.victim.bodyControl)) {
      return [Reaction.Dodge, 0]
    }

    // TODO: Check if hit with shooter's BC
    const hurtEvent = new HurtEvent(
      Calculator.withCritical(actor.throwDamages, actor.specie.critical),
      DieReason.Missile,
      this.levelMap,
      this.game
    )

    return [this.victim.on(hurtEvent), hurtEvent.damage]
  }
}
