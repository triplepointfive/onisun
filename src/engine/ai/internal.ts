import { Point, twoDimArray } from '../utils/utils'
import { Creature, Clan } from '../models/creature'

import { sample } from 'lodash'
import { MemoryTile, Memory } from '../models/memory'
import { MoveEvent } from '../events/move_event'
import { Game } from '../models/game'
import { LevelMap, CreatureEvent } from '../../engine'
import { StayEvent } from '../events/stay_event'

const FIRST_STEP: number = 1

export abstract class AI {
  public abstract act(actor: Creature, game: Game): CreatureEvent | undefined

  public reset(): void {}

  protected moveTo(
    actor: Creature,
    destination: Point,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    // TODO: Rethink of it
    const creature = levelMap.at(destination.x, destination.y).creature
    if (creature && creature.id === actor.id) {
      return new StayEvent()
    }

    const path = this.leePath(
      actor,
      actor.stageMemory(levelMap),
      levelMap.creaturePos(actor),
      point => destination.eq(point)
    )

    if (path.length) {
      return new MoveEvent(game, path[0])
    }
  }

  protected followTo(
    actor: Creature,
    destination: Point,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    const path = this.leePath(
      actor,
      actor.stageMemory(levelMap),
      levelMap.creaturePos(actor),
      point => destination.nextTo(point)
    )

    if (path.length) {
      return new MoveEvent(game, path[0])
    }
  }

  protected leePath(
    actor: Creature,
    map: Memory,
    pos: Point,
    destination: (point: Point, tile: MemoryTile) => boolean,
    randomDestination: boolean = false
  ): Point[] {
    let stageMemory: number[][] = twoDimArray(map.width, map.height, () => -1)
    let pointsToVisit: Point[] = []
    let pointsToCheck: Point[] = [pos]

    let step = 0
    while (pointsToCheck.length && !pointsToVisit.length) {
      let wavePoints: Array<Point> = []

      pointsToCheck.forEach((point: Point) => {
        if (!map.inRange(point)) {
          return
        }

        const tile = map.at(point.x, point.y)
        // TODO: Compare, current value might be lower
        if (tile.tangible(actor) || stageMemory[point.x][point.y] !== -1) {
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
        return this.buildRoad(randomPointToVisit, stageMemory)
      } else {
        return this.buildRoad(pointsToVisit[0], stageMemory)
      }
    } else {
      return []
    }
  }

  private buildRoad(point: Point, stageMemory: number[][]): Point[] {
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

  protected withinView(
    map: Memory,
    pos: Point,
    visit: (point: Point, tile: MemoryTile) => void
  ): void {
    let tileVisited: boolean[][] = twoDimArray(
      map.width,
      map.height,
      () => false
    )
    let pointsToCheck: Point[] = [pos]

    while (pointsToCheck.length) {
      let wavePoints: Point[] = []

      pointsToCheck.forEach((point: Point) => {
        if (!map.inRange(point)) {
          return
        }

        const tile = map.at(point.x, point.y)
        if (!tile.visible || tileVisited[point.x][point.y]) {
          return
        }

        tileVisited[point.x][point.y] = true

        visit(point, tile)

        point.wrappers().forEach(dist => wavePoints.push(dist))
      })

      pointsToCheck = wavePoints
    }
  }

  public enemies(actor: Creature, enemy: Creature): boolean {
    if (actor.id === enemy.id) {
      return false
    }

    if (actor.clan === Clan.FreeForAll || enemy.clan === Clan.FreeForAll) {
      return true
    }

    if (actor.clan === Clan.Player && enemy.clan === Clan.PlayerOnlyEnemy) {
      return true
    }

    if (enemy.clan === Clan.Player && actor.clan === Clan.PlayerOnlyEnemy) {
      return true
    }

    return false
  }
}

export abstract class FollowTargetAI extends AI {
  public destination?: Point = undefined

  public act(actor: Creature, game: Game): CreatureEvent | undefined {
    if (!(this.foundNewTarget(actor, game) || !!this.destination)) {
      return
    }

    if (!this.destination) {
      throw `FollowTargetAI's act got called when there is no destination!`
    }
    const pos = game.currentMap.creaturePos(actor)

    const event = this.goTo(actor, game, this.destination)
    if (event) {
      return event
    }

    // if (event) {
    //   this.onMove(actor)
    //   // If got the destination
    //   if (this.destination.eq(pos)) {
    //     this.destination = undefined
    //     return this.onReach(actor, game)
    //   }
    // } else {
    // If can not move
    this.destination = undefined
    this.onCantMove(actor)
    // }

    return
  }

  public reset(): void {
    this.destination = undefined
  }

  protected goTo(
    actor: Creature,
    game: Game,
    point: Point
  ): CreatureEvent | undefined {
    return this.moveTo(actor, point, game.currentMap, game)
  }

  protected abstract foundNewTarget(actor: Creature, game: Game): boolean
  protected onMove(actor: Creature): void {}
  protected onReach(actor: Creature, game: Game): CreatureEvent | undefined {
    return
  }
  protected onCantMove(actor: Creature): void {}
}

export abstract class GoToTileAI extends FollowTargetAI {
  constructor(protected matcher: (tile: MemoryTile) => boolean) {
    super()
  }

  protected foundNewTarget(actor: Creature, game: Game): boolean {
    const path = this.leePath(
      actor,
      actor.stageMemory(game.currentMap),
      game.currentMap.creaturePos(actor),
      (point, tile) => this.matcher(tile),
      true
    )

    if (path.length) {
      this.destination = path.pop()
      return true
    } else {
      return false
    }
  }
}
