import { AI } from './internal'
import { Creature } from '../creature'

export class Loiter extends AI {
  act( walker: Creature ): void {}

  public available(walker: Creature): boolean {
    return true
  }
}
