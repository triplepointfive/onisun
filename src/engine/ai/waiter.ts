import { AI } from './internal'
import { CreatureEvent } from '../events/internal'
import { StayEvent } from '../events/stay_event'
import { Creature } from '../models/creature'
import { LevelMap } from '../models/level_map'

export class Waiter extends AI {
  act(actor: Creature, levelMap: LevelMap): CreatureEvent | undefined {
    return new StayEvent(levelMap)
  }
}
