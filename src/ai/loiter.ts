import { AI } from './internal'
import { Creature } from '../creature'

export class Loiter extends AI {
  private turns: number = 0

  constructor(public prevAI?: AI) {
    super()
  }

  act(actor: Creature, firstTurn: boolean = true): void {
    if (this.turns > 1) {
      actor.ai = this.prevAI
      this.prevAI.act(actor, false)
      return
    }

    const path = this.leePath(
      actor,
      point => !actor.pos.eq(point),
      true,
    )

    if (path.length) {
      this.turns += 1
      actor.move(path[0])
    }
  }

  public available(walker: Creature): boolean {
    return true
  }
}
