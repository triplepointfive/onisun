import { Reaction } from './internal'
import { VisibleCreatureEvent } from './visible_creature_event'
import { Creature } from '../models/creature'
import { LevelMap } from '../models/level_map'
import { Game } from '../models/game'
import { Door } from '../models/tile'

export class CloseDoorEvent extends VisibleCreatureEvent {
  constructor(private door: Door, levelMap: LevelMap, game: Game) {
    super(levelMap, game)
  }

  public affectCreature(creature: Creature): Reaction {
    if (this.door.open) {
      this.door.open = false
      this.game.logger.doorLogger.close()
    } else {
      this.game.logger.doorLogger.alreadyClosed()
    }

    return Reaction.Nothing
  }
}
