import { CreatureEvent } from './internal'
import { Trap } from '../models/tile'
import { Creature, Reaction, Player } from '../models/creature'
import { Game } from '../models/game'
import { DieEvent } from './die_event'

export class TrapEvent extends CreatureEvent {
  constructor(private trap: Trap, private game: Game) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    // TODO: Special messages for dying.
    let pos = this.game.currentMap.creaturePos(actor)
    if (
      this.game.player.stageMemory(this.game.currentMap.id).at(pos.x, pos.y)
        .visible
    ) {
      this.trap.revealed = true
      this.game.logger.creatureSteppedInTrap(actor)
    }

    return this.doDamage(actor)
  }

  public affectPlayer(actor: Player): Reaction {
    this.game.logger.youSteppedInTrap()
    this.trap.revealed = true

    return this.doDamage(actor)
  }

  private doDamage(actor: Creature): Reaction {
    const damage = 10

    if (damage >= actor.characteristics.health.currentValue()) {
      actor.on(new DieEvent(this.game.currentMap))
      return Reaction.DIE
    } else {
      actor.characteristics.health.decrease(damage)
      return Reaction.HURT
    }
  }
}
