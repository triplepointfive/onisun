import { Reaction } from '../models/creature'
import { Player } from '../models/player'
import { LevelMap } from '../models/level_map'
import { Game } from '../models/game'
import { Trap } from '../models/tile'
import { Point } from '../utils/utils'
import { PlayerEvent } from './internal'

export class UntrapEvent extends PlayerEvent {
  constructor(
    private trapPosition: Point,
    private trap: Trap,
    private levelMap: LevelMap,
    private game: Game
  ) {
    super()
  }

  public affectPlayer(player: Player): Reaction {
    this.trap.untrap(this.trapPosition, player, this.levelMap, this.game)
    return Reaction.NOTHING
  }
}
