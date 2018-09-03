import { CreatureEvent } from './internal'
import { Creature, Reaction } from '../models/creature'
import { AddExperienceEvent } from './add_experience_event'
import { Item } from '../models/items'
import { Game } from '../models/game'
import { DieEvent, DieReason } from './die_event'
import { LevelMap } from '../../engine'

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
    if (actor.characteristics.throwMisses(this.victim.characteristics)) {
      this.game.logger.throwMissMessage(actor, this.victim, this.missile)
      return Reaction.THROW_DODGE
    }

    const damage = actor.characteristics.throwDamageTo(
      this.victim.characteristics,
      this.missile
    )

    if (damage >= this.victim.health.currentValue) {
      actor.on(new AddExperienceEvent(this.victim, this.levelMap, this.game))
      this.game.logger.throwKillMessage(
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
        damage,
        actor,
        this.victim,
        this.missile
      )
      return Reaction.HURT
    }
  }
}
