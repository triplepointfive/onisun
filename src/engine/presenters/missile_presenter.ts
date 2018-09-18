import { Presenter, PresenterType } from './internal'
import { Point, bresenhamInclusion, Direction } from '../utils/utils'
import { Memory } from '../models/memory'
import { IdlePresenter } from './idle_presenter'
import { MissileAttackEvent, Game, LevelMap } from '../../engine'

export class MissilePresenter extends Presenter {
  public targetPos: Point
  private memory: Memory
  private targetEnemyIndex: number | undefined = undefined
  private enemies: Point[] = []
  private path: Point[] = []

  constructor(levelMap: LevelMap, game: Game) {
    super(levelMap, game)

    this.findEnemies()
    this.memory = this.player.stageMemory(this.levelMap)
    this.targetPos = this.resetTargetId()
  }

  get type(): PresenterType {
    return PresenterType.Missile
  }

  public nextTarget(): void {
    if (this.targetEnemyIndex === undefined) {
      this.resetTargetId()
      return
    }

    this.targetEnemyIndex += 1

    if (this.targetEnemyIndex >= this.enemies.length) {
      this.targetEnemyIndex = 0
    }

    this.updateTarget(this.enemies[this.targetEnemyIndex])
  }

  public previousTarget(): void {
    if (this.targetEnemyIndex === undefined) {
      this.resetTargetId()
      return
    }

    this.targetEnemyIndex -= 1

    if (this.targetEnemyIndex < 0) {
      this.targetEnemyIndex = this.enemies.length - 1
    }

    this.updateTarget(this.enemies[this.targetEnemyIndex])
  }

  public moveTarget(direction: Direction): void {
    const dest = this.targetPos.add(direction),
      tile = this.levelMap.at(dest.x, dest.y)

    if (
      tile.visibleThrough() &&
      this.player.stageMemory(this.levelMap).at(dest.x, dest.y).visible
    ) {
      this.updateTarget(dest)
      this.targetEnemyIndex = undefined
    }
  }

  public attack(): void {
    if (!this.targetPos.eq(this.levelMap.creaturePos(this.player))) {
      this.player.on(
        new MissileAttackEvent(this.path, this.game, this.levelMap, () =>
          this.endTurn()
        )
      )
    }
  }

  public close(): void {
    this.resetPath()
    this.redirect(new IdlePresenter(this.levelMap, this.game))
  }

  private resetTargetId(): Point {
    let point: Point

    if (this.enemies.length) {
      this.targetEnemyIndex = 0
      point = this.enemies[this.targetEnemyIndex]
    } else {
      this.targetEnemyIndex = undefined
      point = this.levelMap.creaturePos(this.player)
    }

    this.updateTarget(point)
    return point
  }

  private resetPath(): void {
    this.path.forEach(({ x, y }) => (this.memory.at(x, y).effect = undefined))
  }

  private updateTarget(newPos: Point): void {
    this.resetPath()
    this.targetPos = newPos.copy()
    this.drawPath()
  }

  private drawPath(): void {
    this.path = []
    let stop = false
    const stage = this.levelMap,
      pos = this.levelMap.creaturePos(this.player)

    bresenhamInclusion(pos, this.targetPos, (x, y) => {
      if (!stage.at(x, y).passibleThrough()) {
        stop = true
      }

      this.path.push(new Point(x, y))
      this.memory.at(x, y).effect = stop ? 'o' : 'x'
    })
  }

  private findEnemies(): void {
    this.enemies = []

    this.player.stageMemory(this.levelMap).each((tile, x, y) => {
      if (
        tile.visible &&
        tile.creature &&
        tile.creature.id !== this.player.id
      ) {
        this.enemies.push(new Point(x, y))
      }
    })
  }
}
