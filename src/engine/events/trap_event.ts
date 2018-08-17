import { CreatureEvent } from './internal'
import { Trap } from '../tile'
import { Creature, Reaction } from '../creature'

export class TrapEvent extends CreatureEvent {
  constructor(private trap: Trap) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    const damage = 10,
      game = actor.currentLevel.game

    // TODO: Special messages for dying.
    if (game.player.stageMemory().at(actor.pos.x, actor.pos.y).visible) {
      if (game.player.id === actor.id) {
        game.logger.youSteppedInTrap()
      } else {
        game.logger.creatureSteppedInTrap(actor)
      }
    }

    if (damage >= actor.characteristics.health.currentValue()) {
      actor.die()
      return Reaction.DIE
    } else {
      actor.characteristics.health.decrease(damage)
      return Reaction.HURT
    }
  }
}
