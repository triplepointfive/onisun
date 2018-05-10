import { AI } from '../ai'
import { Creature } from '../creature'

export class Waiter extends AI {
  act( walker: Creature ): void {}

  public available(walker: Creature): boolean {
    return true
  }
}
