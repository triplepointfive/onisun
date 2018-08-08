import { Screen, ScreenType } from './internal'
import { Game } from '../game'
import { Point, bresenham, bresenhamInclusion, Direction } from '../utils'
import { Memory } from '../memory';
import { IdleScreen } from './idle_screen';
import { AIMissileAttack } from '../../engine';

export class MissileScreen extends Screen {
  public targetPos: Point
  private memory: Memory
  private targetEnemyIndex: number = undefined
  private enemies: Point[] = []
  private path: Point[] = []

  constructor(game: Game) {
    super(ScreenType.Missile, game)

    this.findEnemies()
    this.memory = this.player.stageMemory()
    this.resetTargetId()
  }

  public nextTarget(): void {
    if (this.targetEnemyIndex === undefined) {
      return this.resetTargetId()
    }

    this.targetEnemyIndex += 1

    if (this.targetEnemyIndex >= this.enemies.length) {
      this.targetEnemyIndex = 0
    }

    this.updateTarget(this.enemies[this.targetEnemyIndex])
  }

  public previousTarget(): void {
    if (this.targetEnemyIndex === undefined) {
      return this.resetTargetId()
    }

    this.targetEnemyIndex -= 1

    if (this.targetEnemyIndex < 0) {
      this.targetEnemyIndex = this.enemies.length - 1
    }

    this.updateTarget(this.enemies[this.targetEnemyIndex])
  }

  public moveTarget(direction: Direction): void {
    const stage = this.player.currentLevel,
      dest = this.targetPos.add(direction),
      tile = stage.at(dest.x, dest.y)

    if (tile.visibleThrough() && this.player.stageMemory().at(dest.x, dest.y).visible) {
      this.updateTarget(dest)
      this.targetEnemyIndex = undefined
    }
  }

  public attack(): void {
    if (!this.targetPos.eq(this.player.pos)) {
      new AIMissileAttack(this.path, this.game).act()
    }
  }

  public close(): void {
    this.resetPath()
    this.game.screen = new IdleScreen(this.game)
  }

  private resetTargetId(): void {
    if (this.enemies.length) {
      this.targetEnemyIndex = 0
      this.updateTarget(this.enemies[this.targetEnemyIndex])
    } else {
      this.targetEnemyIndex = undefined
      this.updateTarget(this.player.pos)
    }
  }

  private resetPath(): void {
    this.path.forEach(({ x, y }) => this.memory.at(x, y).effect = undefined)
  }

  private drawPath(): void {
    this.path = []
    let stop = false
    const stage = this.player.currentLevel

    bresenhamInclusion(this.player.pos, this.targetPos, (x, y) => {
      if (!stage.at(x, y).passibleThrough()) {
        stop = true
      }

      this.path.push(new Point(x, y))
      this.memory.at(x, y).effect = stop ? 'o' : 'x'
    })
  }

  private updateTarget(newPos: Point): void {
    this.resetPath()
    this.targetPos = newPos.copy()
    this.drawPath()
  }

  private findEnemies(): void {
    this.enemies = []

    this.player.stageMemory().each((tile, x, y) => {
      if (tile.visible && tile.creature() && tile.creature().id !== this.player.id) {
        this.enemies.push(new Point(x, y))
      }
    })
  }
}
