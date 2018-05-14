import { AI } from './internal'
import { Creature } from '../creature'

export class Waiter extends AI {
  act(actor: Creature): void {}

  public available(actor: Creature): boolean {
    return true
  }
}
