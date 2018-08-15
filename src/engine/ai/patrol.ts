import { AI } from './internal'

import { Point, succ } from '../utils'
import { Creature } from '../creature'

import * as graphlib from 'graphlib'
import { Loiter } from './loiter'
import { MetaAI } from './meta_ai'
import { TileVisitor } from '../tile'

type NodeID = string

const NEW_POINT_EVERY: number = 10

class PatrolTileVisitor extends TileVisitor {
  public status: boolean = false

  public addNode(actor: Creature): boolean {
    this.status = false
    actor.currentLevel.at(actor.previousPos.x, actor.previousPos.y).visit(this)
    return this.status
  }

  public onDoor() {
    this.status = true
  }
}

export class Patrol extends AI {
  private i: NodeID
  private graph: graphlib.Graph
  private lastNodeVisit: { [key: string]: number }
  private currentNodeID: NodeID
  private targetNodeID: NodeID
  private path: Point[]
  private step: number = NEW_POINT_EVERY

  constructor(ai: MetaAI) {
    super(ai)
    this.i = 'a'

    this.graph = new graphlib.Graph()

    this.lastNodeVisit = {}

    this.markNodeVisited(this.currentNodeID)
    this.path = []
  }

  public available(actor: Creature): boolean {
    return this.graph.nodes().length > 1
  }

  public act(actor: Creature, firstTurn: boolean = true): void {
    if (this.path.length) {
      this.moveToTarget(actor, firstTurn)
    } else {
      if (this.targetNodeID) {
        this.markNodeVisited(this.targetNodeID)
        this.currentNodeID = this.targetNodeID
      }

      this.pickUpNewTarget(actor)
      this.moveToTarget(actor, firstTurn)
    }
    this.step += 1
  }

  public reset(): void {
    this.path = []
  }

  public trackMovement(actor: Creature): void {
    if (
      this.step >= NEW_POINT_EVERY ||
      new PatrolTileVisitor().addNode(actor)
    ) {
      this.addNode(actor.pos.x, actor.pos.y)
    }
    this.step += 1
  }

  // TODO: If close enough to another node, use it instead.
  public addNode(x: number, y: number): void {
    this.graph.setNode(this.i, new Point(x, y))
    if (this.currentNodeID && this.currentNodeID !== this.i) {
      this.graph.setEdge(this.currentNodeID, this.i)
    }
    this.currentNodeID = this.i
    this.i = succ(this.i)
    this.step = 0
  }

  private buildNewPath(actor: Creature): void {
    const pos: Point = this.graph.node(this.targetNodeID)

    this.path = this.leePath(actor, point => pos.eq(point))
  }

  private pickUpNewTarget(actor: Creature): void {
    let seenLastID: NodeID = this.graph.nodes()[0]
    let seenLastStep: number = this.lastNodeVisit[seenLastID]

    this.graph.neighbors(this.currentNodeID).forEach((nodeID: NodeID) => {
      if (seenLastStep > (this.lastNodeVisit[nodeID] || 0)) {
        seenLastID = nodeID
        seenLastStep = this.lastNodeVisit[seenLastID]
      }
    })

    this.targetNodeID = seenLastID
    this.buildNewPath(actor)
  }

  private moveToTarget(actor: Creature, firstTurn: boolean): void {
    const nextPoint: Point = this.path.shift()

    if (!nextPoint) {
      if (firstTurn) {
        this.path = []
        this.act(actor, false)
      } else {
        new Loiter(this.prevAI).act(actor, firstTurn)
      }
    } else if (
      actor
        .stageMemory()
        .at(nextPoint.x, nextPoint.y)
        .tangible()
    ) {
      this.buildNewPath

      if (this.path.length) {
        return this.act(actor, false)
      }
    } else {
      actor.move(nextPoint)
    }
  }

  private markNodeVisited(nodeID: NodeID): void {
    this.lastNodeVisit[nodeID] = this.step
  }
}
