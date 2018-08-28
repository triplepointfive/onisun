import { Point, twoDimArray } from '../utils/utils'
import { Creature, Clan } from '../models/creature'

import { MemoryTile, Memory } from '../models/memory'
import { MoveEvent } from '../events/move_event'
import { Game } from '../models/game'
import { LevelMap, CreatureEvent, leePath } from '../../engine'

export abstract class AI {
  public abstract act(
    actor: Creature,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined

  protected moveTo(
    actor: Creature,
    destination: Point,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    return this.move(actor, levelMap, game, point => destination.eq(point))
  }

  protected move(
    actor: Creature,
    levelMap: LevelMap,
    game: Game,
    dest: (point: Point, tile: MemoryTile) => boolean
  ): CreatureEvent | undefined {
    const [point] = this.buildPath(actor, levelMap, dest)

    if (point) {
      return new MoveEvent(game, levelMap, point)
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

  public act(
    actor: Creature,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    if (!this.foundNewTarget(actor, levelMap) || !this.destination) {
      return this.checkCurrentTile(actor, levelMap, game)
    }

    const event = this.goTo(actor, levelMap, game, this.destination)
    if (event) {
      return event
    }

    this.destination = undefined
    this.onCantMove(actor)

    return
  }

  protected goTo(
    actor: Creature,
    levelMap: LevelMap,
    game: Game,
    point: Point
  ): CreatureEvent | undefined {
    return this.moveTo(actor, point, levelMap, game)
  }

  protected checkCurrentTile(
    actor: Creature,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    if (this.destination && levelMap.creaturePos(actor).eq(this.destination)) {
      this.destination = undefined
      return this.onReach(actor, levelMap, game)
    }
  }

  protected abstract foundNewTarget(
    actor: Creature,
    levelMap: LevelMap
  ): boolean
  protected onMove(actor: Creature): void {}
  protected onReach(
    actor: Creature,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    return
  }
  protected onCantMove(actor: Creature): void {}
}

export abstract class GoToTileAI extends FollowTargetAI {
  constructor(protected matcher: (tile: MemoryTile) => boolean) {
    super()
  }

  protected checkCurrentTile(
    actor: Creature,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    let event = super.checkCurrentTile(actor, levelMap, game)

    if (event) {
      return event
    }

    const pos = levelMap.creaturePos(actor)
    if (this.matcher(actor.stageMemory(levelMap).at(pos.x, pos.y))) {
      this.destination = undefined
      return this.onReach(actor, levelMap, game)
    }
  }

  protected foundNewTarget(actor: Creature, levelMap: LevelMap): boolean {
    const path = leePath(
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
