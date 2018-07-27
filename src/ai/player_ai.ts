import { MetaAI, AIEventType } from './meta_ai';
import { Player } from '../creature';
import { LevelMap } from '../map';
import { LevelUpScreen, IdleScreen } from '../screen'

export class PlayerAI extends MetaAI {
  public act(player: Player): void {
    const stage: LevelMap = player.currentLevel

    this.events.forEach(event => {
      event.act(player)
    })

    this.resetEvents()

    stage.game.screen = new IdleScreen(stage.game)
    // if (this.levelUps > 0) {
    //   stage.game.screen = new LevelUpScreen(stage.game)
    // }
  }
}
