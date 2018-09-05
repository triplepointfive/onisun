import { CreatureEvent } from './internal'
import { LevelMap } from '../models/level_map'
import { Creature, Reaction } from '../models/creature'
import { Damage } from '../lib/damage'
import { Game } from '../models/game'
import { DieEvent, DieReason } from './die_event'
import { Calculator } from '../lib/calculator'

export class HurtEvent extends CreatureEvent {
  constructor(
    private damages: Damage[],
    private levelMap: LevelMap,
    private game: Game
  ) {
    super()
  }

  public affectCreature(subject: Creature): Reaction {
    const { damage, resist } = Calculator.damage(
      this.damages,
      subject.protections,
      subject.resistances
    )

    if (resist) {
      return Reaction.RESIST
    }

    if (damage >= subject.health.currentValue) {
      subject.on(new DieEvent(this.game, this.levelMap, DieReason.Attack))
      return Reaction.DIE
    } else if (damage <= 0) {
      return Reaction.NOTHING
    } else {
      subject.health.decrease(damage)
      return Reaction.HURT
    }
  }
}
