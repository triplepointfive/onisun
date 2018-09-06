import { PresenterType } from './internal'

import { LevelMap, Game, IdlePresenter } from '../../engine'
import { PickPointPresenter } from './pick_point_presenter'

export enum LookPresenterVisibility {
  See,
  Recall,
  Hidden,
}

export class LookPresenter extends PickPointPresenter<
  LookPresenterVisibility,
  string
> {
  constructor(levelMap: LevelMap, game: Game) {
    super(PresenterType.Look, levelMap, game, '_', target =>
      this.memory.inRange(target)
    )
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
          break
        case 1:
          messages.push(`Лежит ${this.memoryTile.items.bunch[0].item.name}`)
          break
        default:
          messages.push('Лежит несколько предметов')
      }
    }

    return messages
  }

  protected close(): void {
    this.redirect(new IdlePresenter(this.levelMap, this.game))
  }
}
