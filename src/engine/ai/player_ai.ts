import { MetaAI } from './meta_ai'
import { Player } from '../creature'
import { IdlePresenter } from '../../engine'

export class PlayerAI extends MetaAI {
  public act(player: Player): void {
    const game = player.currentLevel.game

    // this.runEvents(player)
    game.screen = new IdlePresenter(game)
    game.ai = this
  }
}
