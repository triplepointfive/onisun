import { CreatureEvent } from './internal'
import { Trap } from '../models/tile'
import { Creature, Reaction, Player } from '../models/creature'
import { Game } from '../models/game'
import { DieEvent, DieReason } from './die_event'
import { LevelMap } from '../models/level_map'

export class TrapEvent extends CreatureEvent {
  constructor(
    private trap: Trap,
    private levelMap: LevelMap,
    private game: Game
  ) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    // TODO: Special messages for dying.
    let pos = this.levelMap.creaturePos(actor)
    if (this.game.player.stageMemory(this.levelMap).at(pos.x, pos.y).visible) {
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

    if (damage >= actor.health.currentValue) {
      actor.on(new DieEvent(this.game, this.levelMap, DieReason.Trap))
      return Reaction.DIE
    } else {
      actor.health.decrease(damage)
      return Reaction.HURT
    }
  }
}
