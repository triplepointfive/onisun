import { AI } from './internal'

import { Point, rand, succ } from '../utils'
import { Creature } from '../creature'

import { Loiter } from './loiter'

import * as graphlib from 'graphlib'

type NodeID = string

class Patrol extends AI {
  private i: NodeID
  private step: number
  private graph: graphlib.Graph
  private lastNodeVisit: { [ key: string ]: number }
  private currentNodeID: NodeID
  private targetNodeID: NodeID
  private path: Point[]

  constructor( x: number, y: number ) {
    super()
    this.i = 'a'

    this.step = 0
    this.graph = new graphlib.Graph()

    this.addNode( x, y, false )
    this.lastNodeVisit = {}

    this.markNodeVisited( this.currentNodeID )
    this.path = []
  }

  public available(actor: Creature): boolean {
    return this.graph.nodes().length > 1
  }

  public act(actor: Creature, firstTurn: boolean = true): void {
    if ( this.path.length ) {
      this.moveToTarget( actor, firstTurn )
    } else {
      if ( this.targetNodeID ) {
        this.markNodeVisited( this.targetNodeID )
        this.currentNodeID = this.targetNodeID
      }

      this.pickUpNewTarget( actor )
      this.moveToTarget( actor, firstTurn )
    }
    this.step += 1
  }

  // TODO: If close enough to another node, use it instead.
  public addNode( x: number, y: number, withEdge: boolean = true ): void {
    this.graph.setNode( this.i, { x: x, y: y } )
    if ( withEdge ) {
      this.graph.setEdge( this.currentNodeID, this.i )
    }
    this.currentNodeID = this.i
    this.i = succ( this.i )
  }

  private buildNewPath( actor: Creature ): void {
    const pos: Point = this.graph.node( this.targetNodeID )

    this.path = this.leePath(actor, point => pos === point)
  }

  private pickUpNewTarget( actor: Creature ): void {
    let seenLastID: NodeID = this.graph.nodes()[0]
    let seenLastStep: number = this.lastNodeVisit[ seenLastID ]

    this.graph.neighbors( this.currentNodeID ).forEach( ( nodeID: NodeID ) => {
      if (seenLastStep > (this.lastNodeVisit[ nodeID ] || 0)) {
        seenLastID = nodeID
        seenLastStep = this.lastNodeVisit[ seenLastID ]
      }
    })

    this.targetNodeID = seenLastID
    this.buildNewPath( actor )
  }

  private moveToTarget( actor: Creature, firstTurn: boolean ): void {
    const nextPoint: Point = this.path.shift()

    if (!nextPoint) {
      actor.ai = new Loiter(this)
    } else if ( actor.stageMemory().at(nextPoint.x,  nextPoint.y).tangible() ) {
      this.buildNewPath

      if (this.path.length) {
        return this.act( actor, false )
      }

      let explorer = new Loiter(this)

      if (explorer.available(actor)) {
        actor.ai = explorer
        explorer.act(actor)
      }
    } else {
      actor.move(nextPoint)
    }
  }

  private markNodeVisited( nodeID: NodeID ): void {
    this.lastNodeVisit[ nodeID ] = this.step
  }
}

export { Patrol }
