import { Presenter, PresenterType } from './internal'

import { Point, Memory, MemoryTile, LevelMap, Game, Direction, IdlePresenter } from '../../engine'

export enum LookPresenterVisibility {
  See,
  Recall,
  Hidden
}

export class LookPresenter extends Presenter {
  public targetPos: Point
  private memory: Memory

  constructor(levelMap: LevelMap, game: Game) {
    super(PresenterType.Look, levelMap, game)

    this.memory = this.player.stageMemory(this.levelMap)
    this.targetPos = levelMap.creaturePos(this.player)
  }

  get title(): LookPresenterVisibility {
    if (this.memoryTile.visible) {
      return LookPresenterVisibility.See
    } else if (this.memoryTile.seen) {
      return LookPresenterVisibility.Recall
    } else {
      return LookPresenterVisibility.Hidden
    }
  }

  get body(): string[] {
    let messages = []

    if (this.memoryTile.creature) {
      if (this.memoryTile.creature.id === this.player.id) {
        messages.push('Это я')
      } else {
        messages.push(`Это ${this.memoryTile.creature.name}`)
      }
    }

    if (this.memoryTile.items) {
      switch (this.memoryTile.items.bunch.length) {
        case 0:
          break;
        case 1:
          messages.push(`Лежит ${this.memoryTile.items.bunch[0].item.name}`)
          break
        default:
          messages.push('Лежит несколько предметов')
      }
    }

    return messages
  }

  get memoryTile(): MemoryTile {
    return this.memory.at(this.targetPos.x, this.targetPos.y)
  }

  public moveTarget(direction: Direction): void {
    const dest = this.targetPos.add(direction)

    if (this.memory.inRange(dest)) {
      this.updateTarget(dest)
    }
  }

  public close(): void {
    this.removeEffect()
    this.redirect(new IdlePresenter(this.levelMap, this.game))
  }

  private removeEffect(): void {
    this.memory.at(this.targetPos.x, this.targetPos.y).effect = undefined
  }

  private updateTarget(newPos: Point): void {
    this.removeEffect()
    this.targetPos = newPos.copy()
    this.drawPath()
  }

  private drawPath(): void {
    this.memoryTile.effect = '_'
  }
}
