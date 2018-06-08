import { AI } from '../ai'

import { Point } from '../utils'
import { Creature } from '../creature'

export class Explorer extends AI {
  path: Point[] = []

  public available(actor: Creature): boolean {
    if (this.path.length) {
      return true
    } else {
      this.buildNewPath(actor)
      return this.path.length > 0
    }
  }

  act(actor: Creature, firstTurn: boolean = true): void {
    if (this.path.length) {
      const nextPoint: Point = this.path.shift()
      if (actor.stageMemory().at(nextPoint.x, nextPoint.y).tangible(actor)) {
        this.path = []
        if (firstTurn) {
          this.act(actor, false)
        }
      } else {
        actor.move(nextPoint)
      }
    } else {
      this.buildNewPath(actor)

      if (this.path.length) {
        if (firstTurn) {
          this.act(actor, false)
        }
      } else {
        // TODO: Happens when the last point in a path is tangible
        // Just call parent to give it one more chance
        this.prevAI.act(actor, true)
      }
    }
  }

  private buildNewPath(actor: Creature): void {
    this.path = this.leePath(actor, point => {
      return !actor.stageMemory().at(point.x, point.y).seen
    })
  }
}
