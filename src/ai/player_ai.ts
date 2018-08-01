import { MetaAI } from './meta_ai'
import { Player } from '../creature'
import { LevelUpScreen, IdleScreen } from '../screen'

export class PlayerAI extends MetaAI {
  public act(player: Player): void {
    const game = player.currentLevel.game

    // this.runEvents(player)
    game.screen = new IdleScreen(game)
    // if (this.levelUps > 0) {
    //   stage.game.screen = new LevelUpScreen(stage.game)
    // }
  }
}
