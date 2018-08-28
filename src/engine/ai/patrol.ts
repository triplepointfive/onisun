import { AI } from './internal'

import { Point, succ } from '../utils/utils'
import { Creature } from '../models/creature'

import * as graphlib from 'graphlib'
import { Loiter } from './loiter'
import { TileVisitor, Tile } from '../models/tile'
import { MoveEvent } from '../events/move_event'
import { Game } from '../models/game'
import { CreatureEvent } from '../events/internal'
import { LevelMap } from '../models/level_map'

type NodeID = string

const NEW_POINT_EVERY: number = 10

class PatrolTileVisitor extends TileVisitor {
  public status: boolean = false

  constructor(private tile: Tile) {
    super()
  }

  public addNode(): boolean {
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

  public act(
    actor: Creature,
    levelMap: LevelMap,
    game: Game,
    firstTurn: boolean = true
  ): CreatureEvent | undefined {
    if (this.graph.nodes().length <= 1) {
      return
    }

    if (this.firstCallPatrol) {
      const pos = levelMap.creaturePos(actor)
      this.addNode(pos)
      this.firstCallPatrol = false
    }

    this.step += 1

    if (this.path.length) {
      return this.moveToTarget(actor, levelMap, game, firstTurn)
    } else {
      if (this.targetNodeID) {
        this.markNodeVisited(this.targetNodeID)
        this.currentNodeID = this.targetNodeID
      }

      this.pickUpNewTarget(actor, levelMap)
      return this.moveToTarget(actor, levelMap, game, firstTurn)
    }
  }

  public reset(): void {
    this.path = []
  }

  public trackMovement(pos: Point, tile: Tile): void {
    if (this.step >= NEW_POINT_EVERY || new PatrolTileVisitor(tile).addNode()) {
      this.addNode(pos)
    }
    this.step += 1
  }

  // TODO: If close enough to another node, use it instead.
  public addNode(point: Point): void {
    this.graph.setNode(this.i, point)
    if (this.currentNodeID && this.currentNodeID !== this.i) {
      this.graph.setEdge(this.currentNodeID, this.i)
    }
    this.currentNodeID = this.i
    this.i = succ(this.i)
    this.step = 0
  }

  private buildNewPath(actor: Creature, levelMap: LevelMap): void {
    // TODO: Remove this
    if (!this.targetNodeID) {
      throw 'Patrol has no next targetID'
    }
    const pos: Point = this.graph.node(this.targetNodeID)

    this.path = this.buildPath(actor, levelMap, point => pos.eq(point))
  }

  private pickUpNewTarget(actor: Creature, levelMap: LevelMap): void {
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
    this.buildNewPath(actor, levelMap)
  }

  private moveToTarget(
    actor: Creature,
    levelMap: LevelMap,
    game: Game,
    firstTurn: boolean
  ): CreatureEvent | undefined {
    const nextPoint: Point | undefined = this.path.shift()

    if (!nextPoint) {
      if (firstTurn) {
        this.path = []
        return this.act(actor, levelMap, game, false)
      } else {
        return new Loiter().act(actor, levelMap, game)
      }
    } else if (
      actor
        .stageMemory(levelMap)
        .at(nextPoint.x, nextPoint.y)
        .tangible()
    ) {
      this.buildNewPath(actor, levelMap)

      if (this.path.length) {
        return this.act(actor, levelMap, game, false)
      }
    } else {
      return new MoveEvent(game, levelMap, nextPoint)
    }
  }

  private markNodeVisited(nodeID: NodeID): void {
    this.lastNodeVisit[nodeID] = this.step
  }
}
