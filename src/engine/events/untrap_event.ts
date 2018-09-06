import { CreatureEvent } from './internal'
import { Reaction } from '../models/creature'
import { Player } from '../models/player'
import { LevelMap } from '../models/level_map'
import { Game } from '../models/game'
import { Trap } from '../models/tile'

export class UntrapEvent extends CreatureEvent {
  constructor(
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
    console.log('untrap')
    return Reaction.NOTHING
  }
}
