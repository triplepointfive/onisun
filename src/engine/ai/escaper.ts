import { FollowTargetAI } from './internal'
import { Creature } from '../models/creature'
import { Point, LevelMap } from '../../engine'

import { sumBy } from 'lodash'

const STEP_DISTANCE = 2

export class Escaper extends FollowTargetAI {
  private escapesFrom: [Point, Creature][] = []

  protected foundNewTarget(actor: Creature, levelMap: LevelMap): boolean {
    return (
      this.foundEnemies(actor, levelMap) &&
      this.buildEscapePath(actor, levelMap)
    )
  }

  private buildEscapePath(
    actor: Creature,
    levelMap: LevelMap,
    minDistance: number = actor.visionRadius / 2
  ): boolean {
    if (minDistance <= 1) {
      this.destination = undefined
      return false
    }

    const path = this.buildPath(actor, levelMap, ({ x, y }) => {
      const score = sumBy(this.escapesFrom, ([pos, enemy]) => {
        // I don't use pathfinding since it should try
        // to run away from those who are visible, so the path
        // to them should be straightforward.
        return Math.max(Math.abs(x - pos.x), Math.abs(y - pos.y))
      })

      return score >= minDistance
    })

    if (path.length) {
      this.destination = path.pop()
      return true
    } else {
      return this.buildEscapePath(actor, levelMap, minDistance - STEP_DISTANCE)
    }
  }

  private foundEnemies(actor: Creature, levelMap: LevelMap): boolean {
    this.escapesFrom = []

    this.withinView(
      actor.stageMemory(levelMap),
      levelMap.creaturePos(actor),
      (point, tile) => {
        const creature = tile.creature

        if (creature && this.enemies(actor, creature)) {
          this.escapesFrom.push([point, creature])
        }
      }
    )

    return this.escapesFrom.length > 0
  }
}
