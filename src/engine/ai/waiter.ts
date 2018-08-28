import { AI } from './internal'
import { CreatureEvent } from '../events/internal'
import { StayEvent } from '../events/stay_event'

export class Waiter extends AI {
  act(): CreatureEvent | undefined {
    return new StayEvent()
  }
}
