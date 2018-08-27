import { DieReason } from '../events/die_event'
import { Game } from '../models/game'
import { Presenter, PresenterType } from './internal'

export class DeathPresenter extends Presenter {
  constructor(public dieReason: DieReason, game: Game) {
    super(PresenterType.Death, game)
  }

  get playerName(): string {
    return this.game.player.name()
  }
}
