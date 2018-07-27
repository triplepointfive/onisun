import { Logger, LevelMap, Player } from './engine'
import { Screen } from './screen'
import { ProfessionPicker } from './profession'

export abstract class Game {
  public logger: Logger = new Logger()
  public currentMap: LevelMap
  public player: Player
  public screen: Screen
  public running: boolean = false

  constructor(public professionPicker: ProfessionPicker) {
    this.screen = null
  }

  public turn() {
    this.player.ai.runEvents(this.player)

    if (this.running || this.screen) {
      return
    }
    this.running = true

    this.player.currentLevel.turn()
    this.running = false
  }
}
