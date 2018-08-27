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
  public ai: PlayerAI | null = null
  public running: boolean = false
  public effect: TileEffect | null = null

  protected maps: Map<LevelMapId, LevelMap | MapGenerator> = new Map()

  constructor(
    public player: Player,
    public professionPicker: ProfessionPicker
  ) {

  }

  public turn() {
    if (this.running || (this.ai && !this.effect)) {
      return
    }
    this.running = true

    if (this.effect) {
      this.player.rebuildVision()
      this.effect.patchMemory(this.player.stageMemory())

      if (this.effect.done()) {
        this.effect.onDone()
        this.effect = null
      }

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
    const levelMap = this.maps.get(id)

    if (!levelMap) {
      throw `Map with id ${id} is not found`
    }

    if (levelMap instanceof LevelMap) {
      return levelMap
    } else if (levelMap instanceof Function) {
      const builtLevelMap = levelMap(id, this)
      this.maps.set(id, builtLevelMap)
      return builtLevelMap
    } else {
      throw `LevelMap with id ${id} is not found`
    }
  }

  public addMap(id: LevelMapId, generator: MapGenerator): void {
    // TODO: Raise if presence
    this.maps.set(id, generator)
  }

  private levelMapTurn(): void {
    // TODO: Remove!!!
    if (!this.currentMap) {
      throw 'levelMapTurn: Map is undefined'
    }

    let timeline = this.currentMap.timeline,
      map = this.currentMap

    const actorId = timeline.next()

    if (actorId === undefined) {
      throw 'Timeline event is empty!'
    }

    const actor = map.creatures.find(creature => actorId === creature.id)

    if (actor) {
      actor.act(map, this)

      // If they are still on a map
      if (map.creatures.find(creature => actorId === creature.id)) {
        timeline.add(actorId, actor.speed())
      }
    }
  }
}
