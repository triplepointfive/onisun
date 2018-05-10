import { Point, twoDimArray } from './utils'
import { Creature } from './creature'

abstract class AI {
  public abstract act( walker: Creature ): void

  protected leePath(
    walker: Creature,
    destination: ( x: number, y: number ) => boolean
  ): Array< Point > {
    const map = walker.stageMemory()

    let stageMemory: Array< Array< number > > = twoDimArray( map.height, map.width, () => { return undefined } )
    let pointsToVisit: Point[] = []
    let pointsToCheck: Point[] = [new Point(walker.pos.x, walker.pos.y)]

    let step = 0
    while ( pointsToCheck.length && !pointsToVisit.length ) {
      // console.log(pointsToCheck )
      let wavePoints: Array< Point > = []

      pointsToCheck.forEach( ( point: Point ) => {
        // TODO: Compare, current value might be lower
        if ( map.at(point.x ,  point.y).tangible() ||
            stageMemory[ point.x ][ point.y ] !== undefined ) {
          return
        }

        stageMemory[ point.x ][ point.y ] = step
        if ( destination( point.x, point.y ) ) {
          pointsToVisit.push( point )
        } else {
          point.wrappers().forEach(dist => wavePoints.push(dist))
        }
      })
      step++

      pointsToCheck = wavePoints
    }

    if ( pointsToVisit.length ) {
      pointsToVisit[ Math.floor( Math.random() * pointsToVisit.length ) ]
      return buildRoad( pointsToVisit[ 0 ], stageMemory )
    } else {
      return []
    }
  }
}

const buildRoad = function ( point: Point, stageMemory: number[][]): Point[] {
  let lastPoint = point
  let chain = [lastPoint]

  let delta: Point = undefined

  while ( stageMemory[ lastPoint.x ][ lastPoint.y ] !== 0 ) {

    delta = Point.dxy.find( ( dp ): boolean => {
      return stageMemory[ lastPoint.x + dp.x ] &&
        ( stageMemory[ lastPoint.x + dp.x ][ lastPoint.y + dp.y ] === stageMemory[ lastPoint.x ][ lastPoint.y ] - 1 )
    })

    lastPoint = lastPoint.add(delta)

    chain.unshift(lastPoint)
  }

  return chain
}

export { AI }
