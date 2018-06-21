import { Logger } from './logger'
import { LevelMap } from './map'

export abstract class Game {
  public logger: Logger = new Logger()
  public currentMap: LevelMap
}
