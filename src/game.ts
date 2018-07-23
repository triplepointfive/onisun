import { Logger, LevelMap, Player } from './engine'
import { Screen, LevelUp, Scene } from './screen'

export abstract class Game {
  public logger: Logger = new Logger()
  public currentMap: LevelMap
  public player: Player
  public screen: Screen

  constructor() {
    this.screen = new Scene(this)
  }
}
