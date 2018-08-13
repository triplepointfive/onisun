import { Logger, LevelMap, Player, Screen, LevelMapId } from '../engine'
import { ProfessionPicker } from './profession'

type MapGenerator = (id: LevelMapId, game: Game) => LevelMap

export abstract class Game {
  public logger: Logger = new Logger()
  public currentMap: LevelMap
  public player: Player
  public screen: Screen = null
  public running: boolean = false
  public professionPicker: ProfessionPicker

  protected maps: Map<LevelMapId, (LevelMap|MapGenerator)> = new Map()

  public turn() {
    if (this.running || this.screen) {
      return
    }

    this.player.ai.runEvents()

    this.running = true

    while (!this.player.dead && !this.screen) {
      const effect = this.player.currentLevel.turn()

      if (effect) {
        this.player.rebuildVision()
        effect.patchMemory(this.player.stageMemory())

        this.running = false
        return
      }
    }

    this.player.rebuildVision()

    this.running = false
  }

  public getMap(id: LevelMapId): LevelMap {
    let levelMap: (LevelMap|MapGenerator) = this.maps[id]

    if (levelMap instanceof LevelMap) {
      return levelMap
    } else if (levelMap instanceof Function) {
      levelMap = levelMap(id, this)
      this.maps[id] = levelMap
      return levelMap
    } else {
      throw `LevelMap with id ${id} is not found`
    }
  }

  public addMap(id: LevelMapId, generator: MapGenerator): void {
    // TODO: Raise if presence
    this.maps[id] = generator
  }
}
