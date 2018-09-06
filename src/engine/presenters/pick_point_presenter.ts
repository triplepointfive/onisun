import { Presenter, PresenterType } from './internal'
import { Memory, MemoryTile } from '../models/memory'
import { Point, Direction } from '../utils/utils'
import { Game } from '../models/game'
import { LevelMap } from '../models/level_map'

export abstract class PickPointPresenter<Title, Body> extends Presenter {
  public targetPos: Point
  protected memory: Memory

  constructor(
    type: PresenterType,
    levelMap: LevelMap,
    game: Game,
    private effect: string,
    private match: (point: Point) => boolean
  ) {
    super(type, levelMap, game)

    this.memory = this.player.stageMemory(this.levelMap)
    this.targetPos = levelMap.creaturePos(this.player)
  }

  abstract get title(): Title

  abstract get body(): Body[]

  protected abstract close(): void

  public act(): void {
    this.removeEffect()
    this.close()
  }

  get memoryTile(): MemoryTile {
    return this.memory.at(this.targetPos.x, this.targetPos.y)
  }

  public moveTarget(direction: Direction): void {
    const dest = this.targetPos.add(direction)

    if (this.match(dest)) {
      this.updateTarget(dest)
    }
  }

  private removeEffect(): void {
    this.memory.at(this.targetPos.x, this.targetPos.y).effect = undefined
  }

  private updateTarget(newPos: Point): void {
    this.removeEffect()
    this.targetPos = newPos.copy()
    this.drawTarget()
  }

  private drawTarget(): void {
    this.memoryTile.effect = this.effect
  }
}
