import { Point, rand, succ } from '../utils'
import { AI } from '../ai'
import { Creature } from '../creature'

import * as graphlib from 'graphlib'

type NodeID = string

class Patrol extends AI {
  private i: NodeID
  private step: number
  private graph: graphlib.Graph
  private lastNodeVisit: { [ key: string ]: number }
  private currentNodeID: NodeID
  private targetNodeID: NodeID
  private path: Array< Point >

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

  act( walker: Creature ): void {
    if ( this.path.length ) {
      this.moveToTarget( walker )
    } else {
      if ( this.targetNodeID ) {
        this.markNodeVisited( this.targetNodeID )
        this.currentNodeID = this.targetNodeID
      }

      this.pickUpNewTarget( walker )
      this.moveToTarget( walker )
    }
    this.step += 1
  }

  // TODO: If close enough to another node, use it instead.
  addNode( x: number, y: number, withEdge: boolean = true ): void {
    this.graph.setNode( this.i, { x: x, y: y } )
    if ( withEdge ) {
      this.graph.setEdge( this.currentNodeID, this.i )
    }
    this.currentNodeID = this.i
    this.i = succ( this.i )
  }

  private buildNewPath( walker: Creature ): void {
    const pos: Point = this.graph.node( this.targetNodeID )

    this.path = this.leePath( walker, ( x, y ) => {
      return ( pos.x === x ) && ( pos.y === y )
    })
  }

  private pickUpNewTarget( walker: Creature ): void {
    let seenLastID: NodeID = this.currentNodeID
    let seenLastStep: number = this.lastNodeVisit[ seenLastID ]

    this.graph.neighbors( this.currentNodeID ).forEach( ( nodeID: NodeID ) => {
      if ( seenLastStep > ( this.lastNodeVisit[ nodeID ] || 0 ) )
        seenLastID = nodeID
        seenLastStep = this.lastNodeVisit[ seenLastID ]
      }
    )

    this.targetNodeID = seenLastID
    this.buildNewPath( walker )
  }

  private moveToTarget( walker: Creature ): void {
    const nextPoint: Point = this.path.shift()
    if ( walker.stageMemory().at(nextPoint.x,  nextPoint.y).tangible() ) {
      this.path = []
      this.act( walker )
    } else {
      walker.move(nextPoint)
    }
  }

  private markNodeVisited( nodeID: NodeID ): void {
    this.lastNodeVisit[ nodeID ] = this.step
  }
}

export { Patrol }
