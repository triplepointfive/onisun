import { MetaAI } from './meta_ai'
import { Player } from '../creature'
import { IdlePresenter, Game } from '../../engine'
import { Presenter } from '../presenters/internal'

export class PlayerAI extends MetaAI {
  public presenter: Presenter = null
  private player: Player
  private game: Game

  public act(player: Player): void {
    this.player = player
    this.game = player.currentLevel.game

    // this.runEvents(player)
    this.presenter = new IdlePresenter(this.game)
    this.game.ai = this
  }

  public endTurn(): void {
    this.game.ai = null
    this.presenter = null
  }

  public redirect(presenter: Presenter): void {
    this.presenter = presenter
  }
}
