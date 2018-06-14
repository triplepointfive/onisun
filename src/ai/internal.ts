import { Point, twoDimArray } from '../utils'
import { Creature, MemoryTile, Phantom, Clan } from '../creature'

import { sample } from 'lodash'

const FIRST_STEP: number = 1

type AIId = number

export abstract class AI {
  private static lastId: AIId = 0
  public static getId(): AIId {
    return this.lastId++
  }

  constructor(public prevAI?: AI, public id: AIId = AI.getId()) {}

  public abstract act(actor: Creature, firstTurn: boolean): void

  public abstract available(actor: Creature): boolean

  public reset(): void {}

  protected moveTo(actor: Creature, destination: Point): boolean {
    const path = this.leePath(actor, point => destination.eq(point))

    if (path.length) {
      actor.move(path[0])
    }

    return !!path.length
  }

  protected followTo(actor: Creature, destination: Point): boolean {
    const path = this.leePath(actor, point => destination.nextTo(point))

    if (path.length) {
      actor.move(path[0])
    }

    return !!path.length
  }

  protected leePath(
    actor: Creature,
    destination: (point: Point, tile: MemoryTile) => boolean,
    randomDestination: boolean = false
  ): Point[] {
    const map = actor.stageMemory()

    let stageMemory: number[][] = twoDimArray(
      map.height,
      map.width,
      () => undefined
    )
    let pointsToVisit: Point[] = []
    let pointsToCheck: Point[] = [actor.pos]

    let step = 0
    while (pointsToCheck.length && !pointsToVisit.length) {
      let wavePoints: Array<Point> = []

      pointsToCheck.forEach((point: Point) => {
        if (!map.inRange(point)) {
          return
        }

        const tile = map.at(point.x, point.y)
        // TODO: Compare, current value might be lower
        if (
          tile.tangible(actor) ||
          stageMemory[point.x][point.y] !== undefined
        ) {
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
      if (randomDestination) {
        return this.buildRoad(sample(pointsToVisit), stageMemory)
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

    let delta: Point = undefined

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

      if (!delta) {
        return []
      }

      lastPoint = lastPoint.add(delta)

      chain.unshift(lastPoint)
    }

    return chain
  }

  protected withinView(
    actor: Creature,
    visit: (point: Point, tile: MemoryTile) => void
  ): void {
    const map = actor.stageMemory()

    let tileVisited: boolean[][] = twoDimArray(
      map.height,
      map.width,
      () => false
    )
    let pointsToCheck: Point[] = [actor.pos]

    while (pointsToCheck.length) {
      let wavePoints: Array<Point> = []

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

  public enemies(actor: Phantom, enemy: Phantom): boolean {
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
