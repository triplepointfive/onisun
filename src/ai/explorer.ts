import { Point, twoDimArray } from '../utils'
import { AI, TileRecall, Walker, leePath } from '../ai'
import { Patrol } from './patrol'

// import { Logger } from "../logger"

const NEW_POINT_EVERY: number = 10

class Explorer implements AI {
  path: Array< Point >
  private step: number

  constructor( public patrol: Patrol = undefined ) {
    this.path = []
    this.step = NEW_POINT_EVERY
  }

  act( walker: Walker ): void {
    if (this.step === NEW_POINT_EVERY ) {
      this.updatePatrol( walker )
    }

    if ( !this.path.length ) {
      this.buildNewPath( walker )
      if ( this.path.length ) {
        this.act( walker )
      } else {
        // Logger.info( "I'm done, time to patrol" )
        // console.log( "I'm done, time to patrol" )
        walker.ai = this.patrol
      }
    } else {
      const nextPoint: Point = this.path.shift()
      if ( walker.stageMemory.at(nextPoint.x, nextPoint.y).tangible ) {
        this.path = []
        this.act( walker )
      } else {
        walker.x = nextPoint.x
        walker.y = nextPoint.y

        if (this.shouldAddNode(walker)) {
          this.updatePatrol(walker)
        }
      }
    }
  }

  private buildNewPath( walker: Walker ): void {
    this.path = leePath( walker, ( x, y ) => {
      return !walker.stageMemory.at(x, y).seen
    })
  }

  private updatePatrol( walker: Walker ): void {
    this.step = 0
    if ( this.patrol === undefined ) {
      this.patrol = new Patrol( walker.x, walker.y )
    } else {
      this.patrol.addNode( walker.x, walker.y )
    }

    this.step++
  }

  private shouldAddNode(walker: Walker): boolean {
    return walker.stageMemory.at(walker.previousPos.x, walker.previousPos.y).tile.isDoor()
  }
}

export { Explorer }
