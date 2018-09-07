import { Creature } from '../models/creature'
import { AI } from './internal'
import { StayEvent } from '../events/stay_event'
import { CreatureEvent } from '../events/internal'
import { LevelMap } from '../models/level_map'

export class SelfHealer extends AI {
  public act(actor: Creature, levelMap: LevelMap): CreatureEvent | undefined {
    if (actor.health.atMax) {
      return
    }

    return new StayEvent(levelMap)
  }
}
