import { DieReason } from '../events/die_event'
import { Game } from '../models/game'
import { Presenter, PresenterType } from './internal'
import { LevelMap } from '../models/level_map'

export class DeathPresenter extends Presenter {
  constructor(public dieReason: DieReason, levelMap: LevelMap, game: Game) {
    super(PresenterType.Death, levelMap, game)
  }

  get playerName(): string {
    return this.game.player.name
  }
}
