import { Logger, LevelMap, Player } from './engine';

export abstract class Game {
  public logger: Logger = new Logger()
  public currentMap: LevelMap
  public player: Player
}
