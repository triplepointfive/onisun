import { Presenter, PresenterType } from './internal'
import { LevelMap } from '../models/level_map'
import { Game } from '../models/game'

export class PickSingleOptionPresenter<Option> extends Presenter {
  constructor(
    public options: Option[],
    levelMap: LevelMap,
    game: Game,
    private withOption: (option: Option) => void
  ) {
    super(PresenterType.PickHandleOption, levelMap, game)
  }

  public pick(option: Option): void {
    this.withOption(option)
  }

  public close(): void {
    this.goIdle()
  }
}
