import { Creature } from '../models/creature'
import { AI } from './internal'
import { Game } from '../models/game'
import { StayEvent } from '../events/stay_event'
import { CreatureEvent } from '../events/internal'
import { LevelMap } from '../models/level_map'

export class SelfHealer extends AI {
  public act(
    actor: Creature,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    if (actor.characteristics.health.atMax()) {
      return
    }

    return new StayEvent()
  }
}
