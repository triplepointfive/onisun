import { Logger, LevelMap, Player } from './engine'
import { Screen, LevelUp } from './screen'
import { ProfessionPicker } from './profession';

export abstract class Game {
  public logger: Logger = new Logger()
  public currentMap: LevelMap
  public player: Player
  public screen: Screen

  constructor(
    public professionPicker: ProfessionPicker,
  ) {
    this.screen = null
  }
}
