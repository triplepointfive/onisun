import { CreatureEvent } from './internal'
import { Reaction } from '../models/creature'
import { Player } from '../models/player'
import { LevelMap } from '../models/level_map'
import { Game } from '../models/game'
import { Trap } from '../models/tile'
import { Point } from '../utils/utils'

export class UntrapEvent extends CreatureEvent {
  constructor(
    private trapPosition: Point,
    private trap: Trap,
    private levelMap: LevelMap,
    private game: Game
  ) {
    super()
  }

  public affectCreature(): Reaction {
    return Reaction.NOTHING
  }

  public affectPlayer(player: Player): Reaction {
    this.trap.untrap(this.trapPosition, player, this.levelMap, this.game)
    return Reaction.NOTHING
  }
}
