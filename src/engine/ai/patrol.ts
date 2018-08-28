import { AI } from './internal'

import { Point, succ } from '../utils/utils'
import { Creature } from '../models/creature'

import * as graphlib from 'graphlib'
import { Loiter } from './loiter'
import { MetaAI } from './meta_ai'
import { TileVisitor, Tile } from '../models/tile'
import { MoveEvent } from '../events/move_event'
import { Game } from '../models/game'

type NodeID = string

const NEW_POINT_EVERY: number = 10

class PatrolTileVisitor extends TileVisitor {
  public status: boolean = false

  constructor(private tile: Tile) {
    super()
  }

  public addNode(actor: Creature): boolean {
    this.status = false
    this.tile.visit(this)
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
  private targetNodeID: NodeID | undefined
  private path: Point[]
  private step: number = NEW_POINT_EVERY
  private firstCallPatrol: boolean = true

  constructor() {
    super()
    this.i = 'a'

    this.graph = new graphlib.Graph()

    this.lastNodeVisit = {}

    this.currentNodeID = 'a' // TODO: Check it, was undefined
    this.markNodeVisited(this.currentNodeID)
    this.path = []
  }

  public act(actor: Creature, game: Game, firstTurn: boolean = true): boolean {
    if (this.graph.nodes().length === 1) {
      return false
    }

    if (this.firstCallPatrol) {
      const pos = game.currentMap.creaturePos(actor)
      this.addNode(pos.x, pos.y)
      this.firstCallPatrol = false
    }

    if (this.path.length) {
      this.moveToTarget(actor, game, firstTurn)
    } else {
      if (this.targetNodeID) {
        this.markNodeVisited(this.targetNodeID)
        this.currentNodeID = this.targetNodeID
      }

      this.pickUpNewTarget(actor, game)
      this.moveToTarget(actor, game, firstTurn)
    }
    this.step += 1

    return true
  }

  public reset(): void {
    this.path = []
  }

  public trackMovement(actor: Creature, pos: Point, tile: Tile): void {
    if (
      this.step >= NEW_POINT_EVERY ||
      new PatrolTileVisitor(tile).addNode(actor)
    ) {
      this.addNode(pos.x, pos.y)
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

  private buildNewPath(actor: Creature, game: Game): void {
    // TODO: Remove this
    if (!this.targetNodeID) {
      throw 'Patrol has no next targetID'
    }
    const pos: Point = this.graph.node(this.targetNodeID)

    this.path = this.leePath(
      actor,
      actor.stageMemory(game.currentMap),
      game.currentMap.creaturePos(actor),
      point => pos.eq(point)
    )
  }

  private pickUpNewTarget(actor: Creature, game: Game): void {
    let seenLastID: NodeID = this.graph.nodes()[0],
      seenLastStep: number = this.lastNodeVisit[seenLastID],
      nodes = this.graph.neighbors(this.currentNodeID)

    if (nodes) {
      nodes.forEach((nodeID: NodeID) => {
        if (seenLastStep > (this.lastNodeVisit[nodeID] || 0)) {
          seenLastID = nodeID
          seenLastStep = this.lastNodeVisit[seenLastID]
        }
      })
    }

    this.targetNodeID = seenLastID
    this.buildNewPath(actor, game)
  }

  private moveToTarget(actor: Creature, game: Game, firstTurn: boolean): void {
    const nextPoint: Point | undefined = this.path.shift()

    if (!nextPoint) {
      if (firstTurn) {
        this.path = []
        this.act(actor, game, false)
      } else {
        new Loiter().act(actor, game)
      }
    } else if (
      actor
        .stageMemory(game.currentMap)
        .at(nextPoint.x, nextPoint.y)
        .tangible()
    ) {
      this.buildNewPath(actor, game)

      if (this.path.length) {
        this.act(actor, game, false)
      }
    } else {
      actor.on(new MoveEvent(game, nextPoint))
    }
  }

  private markNodeVisited(nodeID: NodeID): void {
    this.lastNodeVisit[nodeID] = this.step
  }
}
