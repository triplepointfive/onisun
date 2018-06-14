import { AI } from '../ai'
import { Creature } from '../creature'

export class SelfHealer extends AI {
  public available(actor: Creature): boolean {
    return actor.characteristics.health.atMax()
  }

  public act(actor: Creature, firstTurn: boolean = true): void {
    actor.characteristics.regenerate()
  }
}