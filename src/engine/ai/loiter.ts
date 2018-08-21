import { AI } from './internal'
import { Creature } from '../models/creature'
import { MoveEvent } from '../events/move_event'

export class Loiter extends AI {
  // private turns: number = 0

  act(actor: Creature, firstTurn: boolean = true): void {
    // if (this.turns > 1) {
    //   actor.ai = this.prevAI
    //   this.prevAI.act(actor, false)
    //   return
    // }

    const path = this.leePath(actor, point => !actor.pos.eq(point), true)

    if (path.length) {
      // this.turns += 1
      actor.on(new MoveEvent(actor.currentLevel.game, path[0]))
    }
  }

  public available(actor: Creature): boolean {
    return true
  }
}
