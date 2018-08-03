import { MetaAI } from './meta_ai'
import { Player } from '../creature'
import { IdleScreen, ProfessionPickingScreen } from '../../engine'

export class PlayerAI extends MetaAI {
  public act(player: Player): void {
    const game = player.currentLevel.game

    // this.runEvents(player)
    game.screen = new IdleScreen(game)

    if (player.levelUps > 0) {
      player.currentLevel.game.screen = new ProfessionPickingScreen(game)
    }
  }
}
