import { AI } from './internal'
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
      // Loit here
    }
  }

  private buildPath(
    actor: Creature,
    minDistance: number = actor.radius,
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

    const field = actor.stageMemory()

    for (let y = 0; y < field.height; y++) {
      for (let x = 0; x < field.width; x++) {
        const creature = field.at(x, y).creature()

        if (creature && creature.id !== actor.id) {
          this.escapesFrom.push(creature)
        }
      }
    }

    return this.escapesFrom.length > 0
  }
}
