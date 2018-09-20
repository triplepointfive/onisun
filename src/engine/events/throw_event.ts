import { CreatureEvent } from './internal'
import { Creature, Reaction } from '../models/creature'
import { AddExperienceEvent } from './add_experience_event'
import { Item } from '../models/item'
import { Game } from '../models/game'
import { DieEvent, DieReason } from './die_event'
import { LevelMap } from '../../engine'
import { Calculator } from '../lib/calculator'

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
    if (Calculator.misses(actor.bodyControl, this.victim.bodyControl)) {
      this.game.logger.throwMissMessage(
        this.game.player,
        actor,
        this.victim,
        this.missile
      )
      return Reaction.THROW_DODGE
    }

    // TODO: Check if hit with shooter's BC

    // TODO: Check has no resistances
    const { damage, resist } = Calculator.damage(
      Calculator.withCritical(actor.throwDamages, actor.specie.critical),
      this.victim.protections,
      this.victim.resistances
    )

    if (damage >= this.victim.health.currentValue) {
      actor.on(new AddExperienceEvent(this.victim, this.levelMap, this.game))
      this.game.logger.throwKillMessage(
        this.game.player,
        damage,
        actor,
        this.victim,
        this.missile
      )
      return this.victim.on(
        new DieEvent(this.game, this.levelMap, DieReason.Missile)
      )
    } else {
      this.victim.health.decrease(damage)
      this.game.logger.throwHurtMessage(
        this.game.player,
        damage,
        actor,
        this.victim,
        this.missile
      )
      return Reaction.HURT
    }
  }
}
