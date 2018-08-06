import { Logger, LevelMap, Player, Screen } from '../engine'
import { ProfessionPicker } from './profession'

export abstract class Game {
  public logger: Logger = new Logger()
  public currentMap: LevelMap
  public player: Player
  public screen: Screen = null
  public running: boolean = false
  public professionPicker: ProfessionPicker

  public turn() {
    if (this.running || this.screen) {
      return
    }

    this.player.ai.runEvents()

    this.running = true

    while (!this.player.dead && !this.screen) {
      this.player.currentLevel.turn()
    }

    this.running = false
  }
}
