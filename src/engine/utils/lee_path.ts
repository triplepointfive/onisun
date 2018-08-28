import { Point, twoDimArray, Mapped } from './utils'

import { sample } from 'lodash'

const FIRST_STEP: number = 1

export const leePath = function<Tile>(
  map: Mapped<Tile>,
  pos: Point,
  tangible: (tile: Tile) => boolean,
  destination: (point: Point, tile: Tile) => boolean,
  randomDestination: boolean = false
): Point[] {
  let stageMemory: number[][] = twoDimArray(map.width, map.height, () => -1)
  let pointsToVisit: Point[] = []
  let pointsToCheck: Point[] = [pos]

  let step = 0
  while (pointsToCheck.length && !pointsToVisit.length) {
    let wavePoints: Point[] = []

    pointsToCheck.forEach((point: Point) => {
      if (!map.inRange(point)) {
        return
      }

      const tile = map.at(point.x, point.y)
      // TODO: Compare, current value might be lower
      if (tangible(tile) || stageMemory[point.x][point.y] !== -1) {
        return
      }

      stageMemory[point.x][point.y] = step
      if (destination(point, tile)) {
        pointsToVisit.push(point)
      } else {
        point.wrappers().forEach(dist => wavePoints.push(dist))
      }
    })
    step++

    pointsToCheck = wavePoints
  }

  if (pointsToVisit.length) {
    // TODO: Remove this check
    let randomPointToVisit = sample(pointsToVisit)
    if (randomDestination && randomPointToVisit) {
      return buildRoad(randomPointToVisit, stageMemory)
    } else {
      return buildRoad(pointsToVisit[0], stageMemory)
    }
  } else {
    return []
  }
}

const buildRoad = function(point: Point, stageMemory: number[][]): Point[] {
  let lastPoint = point
  let chain = [lastPoint]

  let delta: Point | undefined

  while (stageMemory[lastPoint.x][lastPoint.y] !== FIRST_STEP) {
    delta = Point.dxy.find(
      (dp): boolean => {
        return (
          stageMemory[lastPoint.x + dp.x] &&
          stageMemory[lastPoint.x + dp.x][lastPoint.y + dp.y] ===
            stageMemory[lastPoint.x][lastPoint.y] - 1
        )
      }
    )

    if (delta === undefined) {
      return []
    }

    lastPoint = lastPoint.add(delta)

    chain.unshift(lastPoint)
  }

  return chain
}
