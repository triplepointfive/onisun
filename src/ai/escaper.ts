import { AI } from './internal'
import { Loiter } from '../ai'
import { Phantom, Creature, CreatureId } from '../creature'
import { Point } from '../utils'

import { sumBy } from 'lodash'

const STEP_DISTANCE = 2

export class Escaper extends AI {
  private escapesFrom: Phantom[] = []
  private runningTo?: Point

  public available(actor: Creature): boolean {
    return this.foundEnemies(actor)
  }

  public act(actor: Creature): void {
    if (this.foundEnemies(actor)) {
      this.buildPath(actor)
    }

    if (this.runningTo) {
      if (this.moveTo(actor, this.runningTo) && this.runningTo.eq(actor.pos)) {
        this.runningTo = undefined
      }
    } else {
      actor.ai = new Loiter(this)
    }
  }

  private buildPath(
    actor: Creature,
    minDistance: number = actor.radius / 2,
  ): void {
    if (minDistance <= 1) {
      this.runningTo = undefined
      return
    }

    const path = this.leePath(
      actor,
      ({ x, y }) => {
        const score = sumBy(this.escapesFrom, enemy => {
          // TODO: I don't use pathfinding since it should try
          // to run away from those who are visible, so the path
          // to them should be straightforward.
          return Math.max(Math.abs(x - enemy.pos.x), Math.abs(y - enemy.pos.y))
        })

        return score >= minDistance
      },
      true,
    )

    if (path.length) {
      this.runningTo = path.pop()
    } else {
      this.buildPath(actor, minDistance - STEP_DISTANCE)
    }
  }

  private foundEnemies(
    actor: Creature,
  ): boolean {
    this.escapesFrom = []

    this.withinView(
      actor,
      (point, tile) => {
        const creature = tile.creature()

        if (creature && creature.id !== actor.id) {
          this.escapesFrom.push(creature)
        }
      }
    )

    return this.escapesFrom.length > 0
  }
}
