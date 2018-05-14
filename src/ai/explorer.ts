import { AI, Patrol, Loiter } from '../ai'

import { Point, twoDimArray } from '../utils'
import { Creature } from '../creature'

const NEW_POINT_EVERY: number = 10

export class Explorer extends AI {
  path: Point[]
  private step: number

  constructor(public patrol: Patrol = undefined) {
    super()
    this.path = []
    this.step = NEW_POINT_EVERY
  }

  public available(actor: Creature): boolean {
    if (this.path.length) {
      return true
    } else {
      this.buildNewPath(actor)
      return this.path.length > 0
    }
  }

  act(actor: Creature, firstTurn: boolean = true): void {
    if (this.step >= NEW_POINT_EVERY ) {
      this.updatePatrol( actor )
    }

    if (this.path.length) {
      const nextPoint: Point = this.path.shift()
      if (actor.stageMemory().at(nextPoint.x, nextPoint.y).tangible(actor)) {
        this.path = []
        if (firstTurn) {
          this.act(actor, false)
        }
      } else {
        this.step++

        actor.move(nextPoint)

        if (this.shouldAddNode(actor)) {
          this.updatePatrol(actor)
        }
      }
    } else {
      this.buildNewPath(actor)
      if (this.path.length) {
        if (firstTurn) {
          this.act(actor, false)
        }
      } else if (this.patrol.available(actor)) {
        // Logger.info( "I'm done, time to patrol" )
        this.patrol.addNode( actor.pos.x, actor.pos.y )
        actor.ai = this.patrol
        actor.ai.act(actor, false)
      } else {
        actor.ai = new Loiter(this)
      }
    }
  }

  private buildNewPath( actor: Creature ): void {
    this.path = this.leePath( actor, point => {
      return !actor.stageMemory().at(point.x, point.y).seen
    })
  }

  private updatePatrol( actor: Creature ): void {
    if (this.patrol === undefined) {
      this.patrol = new Patrol( actor.pos.x, actor.pos.y )
    } else {
      this.patrol.addNode( actor.pos.x, actor.pos.y )
    }

    this.step = 0
  }

  private shouldAddNode(actor: Creature): boolean {
    return actor.stageMemory().at(actor.previousPos.x, actor.previousPos.y).tile.isDoor()
  }
}
