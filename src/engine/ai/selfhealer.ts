import { Creature } from '../models/creature'
import { AI } from './internal'

export class SelfHealer extends AI {
  public available(actor: Creature): boolean {
    return !actor.characteristics.health.atMax()
  }

  public act(actor: Creature): void {
    // Does nothing, just waiting
    // actor.characteristics.regenerate()
  }
}
