import { FollowTargetAI } from './internal'
import { Creature } from '../models/creature'
import { Point } from '../../engine'

import { sumBy } from 'lodash'

const STEP_DISTANCE = 2

export class Escaper extends FollowTargetAI {
  private escapesFrom: [Point, Creature][] = []

  protected foundNewTarget(actor: Creature): boolean {
    return this.foundEnemies(actor) && this.buildPath(actor)
  }

  private buildPath(
    actor: Creature,
    minDistance: number = actor.radius() / 2
  ): boolean {
    if (minDistance <= 1) {
      this.destination = undefined
      return false
    }

    const path = this.leePath(
      actor,
      ({ x, y }) => {
        const score = sumBy(this.escapesFrom, ([pos, enemy]) => {
          // I don't use pathfinding since it should try
          // to run away from those who are visible, so the path
          // to them should be straightforward.
          return Math.max(Math.abs(x - pos.x), Math.abs(y - pos.y))
        })

        return score >= minDistance
      },
      true
    )

    if (path.length) {
      this.destination = path.pop()
      return true
    } else {
      return this.buildPath(actor, minDistance - STEP_DISTANCE)
    }
  }

  private foundEnemies(actor: Creature): boolean {
    this.escapesFrom = []

    this.withinView(actor, (point, tile) => {
      const creature = tile.creature

      if (creature && this.enemies(actor, creature)) {
        this.escapesFrom.push([point, creature])
      }
    })

    return this.escapesFrom.length > 0
  }
}
