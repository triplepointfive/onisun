import { CreatureEvent, VisibleCreatureEvent } from './internal'
import { Trap } from '../models/tile'
import { Creature, Reaction } from '../models/creature'
import { Player } from '../models/player'
import { Game } from '../models/game'
import { LevelMap } from '../models/level_map'

export class TrapEvent extends VisibleCreatureEvent {
  constructor(
    private trap: Trap,
    private trapEvent: CreatureEvent,
    levelMap: LevelMap,
    game: Game
  ) {
    super(levelMap, game)
  }

  public affectCreature(actor: Creature): Reaction {
    // TODO: Special messages for dying.
    if (this.playerSees(actor)) {
      this.trap.revealed = true
    }

    return actor.on(this.trapEvent)
  }

  public affectPlayer(actor: Player): Reaction {
    this.trap.revealed = true

    return actor.on(this.trapEvent)
  }
}
