import { ProfessionPicker } from './profession'
import { TileEffect } from './tile_effect'
import { LevelMapId, LevelMap } from './level_map'
import { Logger } from './logger'
import { Player } from './creature'
import { PlayerAI } from '../../engine'

type MapGenerator = (id: LevelMapId, game: Game) => LevelMap

export abstract class Game {
  public logger: Logger = new Logger()
  public currentMap: LevelMap
  public player: Player
  public ai: PlayerAI = null
  public running: boolean = false
  public professionPicker: ProfessionPicker
  public effect: TileEffect

  protected maps: Map<LevelMapId, LevelMap | MapGenerator> = new Map()

  public turn() {
    if (this.running || (this.ai && !this.effect)) {
      return
    }
    this.running = true

    const effect = this.effect
    if (this.effect) {
      if (this.effect.done()) {
        this.effect.onDone()
        this.effect = null
      }

      this.player.rebuildVision()
      effect.patchMemory(this.player.stageMemory())

      this.running = false
    } else {
      while (!this.player.dead && !this.ai) {
        this.levelMapTurn()
      }

      this.player.rebuildVision()
    }

    this.running = false
  }

  public getMap(id: LevelMapId): LevelMap {
    let levelMap: LevelMap | MapGenerator = this.maps.get(id)

    if (levelMap instanceof LevelMap) {
      return levelMap
    } else if (levelMap instanceof Function) {
      levelMap = levelMap(id, this)
      this.maps.set(id, levelMap)
      return levelMap
    } else {
      throw `LevelMap with id ${id} is not found`
    }
  }

  public addMap(id: LevelMapId, generator: MapGenerator): void {
    // TODO: Raise if presence
    this.maps.set(id, generator)
  }

  private levelMapTurn(): void {
    let timeline = this.currentMap.timeline,
      map = this.currentMap

    const actorId = timeline.next()

    if (actorId === undefined) {
      throw 'Timeline event is empty!'
    }

    const actor = map.creatures.find(creature => actorId === creature.id)

    if (actor) {
      actor.act(map)

      // If they are still on a map
      if (map.creatures.find(creature => actorId === creature.id)) {
        timeline.add(actorId, actor.speed())
      }
    }
  }
}
