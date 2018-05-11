import { Point, twoDimArray } from '../utils'
import { Creature, MemoryTile } from '../creature'

import { sample } from 'lodash'

const FIRST_STEP: number = 1

export abstract class AI {
  public abstract act(actor: Creature, firstTurn: boolean): void

  public abstract available(actor: Creature): boolean

  protected moveTo(actor: Creature, destination: Point): boolean {
    const path = this.leePath(
      actor,
      point => destination.eq(point),
    )

    if (path.length) {
      actor.move(path[0])
    }

    return !!path.length
  }

  protected followTo(actor: Creature, destination: Point): boolean {
    const path = this.leePath(
      actor,
      point => destination.nextTo(point),
    )

    if (path.length) {
      actor.move(path[0])
    }

    return !!path.length
  }

  protected leePath(
    actor: Creature,
    destination: (point: Point, tile: MemoryTile) => boolean,
    randomDestination: boolean = false,
  ): Array< Point > {
    const map = actor.stageMemory()

    let stageMemory: number[][] = twoDimArray(map.height, map.width, () => undefined)
    let pointsToVisit: Point[] = []
    let pointsToCheck: Point[] = [actor.pos]

    let step = 0
    while ( pointsToCheck.length && !pointsToVisit.length ) {
      let wavePoints: Array< Point > = []

      pointsToCheck.forEach( ( point: Point ) => {
        // TODO: Compare, current value might be lower
        if (!map.inRange(point)) {
          return
        }

        const tile = map.at(point.x ,  point.y)
        if (tile.tangible(actor) ||
            stageMemory[ point.x ][ point.y ] !== undefined ) {
          return
        }

        stageMemory[ point.x ][ point.y ] = step
        if (destination(point, tile)) {
          pointsToVisit.push( point )
        } else {
          point.wrappers().forEach(dist => wavePoints.push(dist))
        }
      })
      step++

      pointsToCheck = wavePoints
    }

    if (pointsToVisit.length) {
      if (randomDestination) {
        return this.buildRoad(sample(pointsToVisit), stageMemory)
      } else {
        return this.buildRoad(pointsToVisit[0], stageMemory)
      }
    } else {
      return []
    }
  }

  private buildRoad(point: Point, stageMemory: number[][]): Point[] {
    let lastPoint = point
    let chain = [lastPoint]

    let delta: Point = undefined

    while ( stageMemory[ lastPoint.x ][ lastPoint.y ] !== FIRST_STEP ) {
      delta = Point.dxy.find( ( dp ): boolean => {
        return stageMemory[ lastPoint.x + dp.x ] &&
          ( stageMemory[ lastPoint.x + dp.x ][ lastPoint.y + dp.y ] === stageMemory[ lastPoint.x ][ lastPoint.y ] - 1 )
      })

      if (!delta) {
        return []
      }

      lastPoint = lastPoint.add(delta)

      chain.unshift(lastPoint)
    }

    return chain
  }
}
