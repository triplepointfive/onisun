import { Point, twoDimArray } from '../utils/utils'
import { Creature, Clan } from '../models/creature'

import { MemoryTile, Memory } from '../models/memory'
import { MoveEvent } from '../events/move_event'
import { Game } from '../models/game'
import { LevelMap, CreatureEvent, leePath } from '../../engine'
import { StayEvent } from '../events/stay_event'

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

    return this.move(actor, game.currentMap, game, point =>
      destination.eq(point)
    )
  }

  protected move(
    actor: Creature,
    levelMap: LevelMap,
    game: Game,
    dest: (point: Point, tile: MemoryTile) => boolean
  ): CreatureEvent | undefined {
    const [point] = this.buildPath(actor, levelMap, dest)

    if (point) {
      return new MoveEvent(game, point)
    }
  }

  protected buildPath(
    actor: Creature,
    levelMap: LevelMap,
    dest: (point: Point, tile: MemoryTile) => boolean
  ): Point[] {
    return leePath(
      actor.stageMemory(levelMap),
      levelMap.creaturePos(actor),
      tile => tile.tangible(actor),
      dest
    )
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
    const levelMap = game.currentMap,
      path = leePath(
        actor.stageMemory(levelMap),
        levelMap.creaturePos(actor),
        tile => tile.tangible(actor),
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
