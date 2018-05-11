import { AI, Patrol, Loiter } from '../ai'

import { Point, twoDimArray } from '../utils'
import { Creature } from '../creature'

const NEW_POINT_EVERY: number = 10

class Explorer extends AI {
  path: Point[]
  private step: number

  constructor(public patrol: Patrol = undefined) {
    super()
    this.path = []
    this.step = NEW_POINT_EVERY
  }

  public available(walker: Creature): boolean {
    if (this.path.length) {
      return true
    } else {
      this.buildNewPath(walker)
      return this.path.length > 0
    }
  }

  act(walker: Creature, firstTurn: boolean = true): void {
    if (this.step === NEW_POINT_EVERY ) {
      this.updatePatrol( walker )
    }

    if (this.path.length) {
      const nextPoint: Point = this.path.shift()
      if (walker.stageMemory().at(nextPoint.x, nextPoint.y).tangible(walker)) {
        this.path = []
        if (firstTurn) {
          this.act(walker, false)
        }
      } else {
        walker.move(nextPoint)

        if (this.shouldAddNode(walker)) {
          this.updatePatrol(walker)
        }
      }
    } else {
      this.buildNewPath(walker)
      if (this.path.length) {
        if (firstTurn) {
          this.act(walker, false)
        }
      } else if (this.patrol.available(walker)) {
        // Logger.info( "I'm done, time to patrol" )
        walker.ai = this.patrol
      } else {
        walker.ai = new Loiter(this)
      }
    }
  }

  private buildNewPath( walker: Creature ): void {
    this.path = this.leePath( walker, point => {
      return !walker.stageMemory().at(point.x, point.y).seen
    })
  }

  private updatePatrol( walker: Creature ): void {
    this.step = 0
    if (this.patrol === undefined) {
      this.patrol = new Patrol( walker.pos.x, walker.pos.y )
    } else {
      this.patrol.addNode( walker.pos.x, walker.pos.y )
    }

    this.step++
  }

  private shouldAddNode(walker: Creature): boolean {
    return walker.stageMemory().at(walker.previousPos.x, walker.previousPos.y).tile.isDoor()
  }
}

export { Explorer }
