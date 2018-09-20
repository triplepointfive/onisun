import { CreatureEvent, Reaction } from './internal'
import { LevelMap } from '../models/level_map'
import { Creature } from '../models/creature'
import { Damage } from '../lib/damage'
import { Game } from '../models/game'
import { DieEvent, DieReason } from './die_event'
import { Calculator } from '../lib/calculator'

export class HurtEvent extends CreatureEvent {
  private doneDamage: number | undefined

  constructor(
    private damages: Damage[],
    private dieReason: DieReason,
    private levelMap: LevelMap,
    private game: Game
  ) {
    super()
  }

  get damage(): number {
    if (this.doneDamage) {
      return this.doneDamage
    } else {
      throw `HurtEvent.damage called but there is no done damage`
    }
  }

  public affectCreature(subject: Creature): Reaction {
    const { damage, resist } = Calculator.damage(
      this.damages,
      subject.protections,
      subject.resistances
    )

    this.doneDamage = damage

    if (resist) {
      return Reaction.RESIST
    }

    if (damage >= subject.health.currentValue) {
      subject.on(new DieEvent(this.game, this.levelMap, this.dieReason))
      return Reaction.DIE
    } else if (damage <= 0) {
      return Reaction.NOTHING
    } else {
      subject.health.decrease(damage)
      return Reaction.HURT
    }
  }
}
