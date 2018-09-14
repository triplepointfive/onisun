import { ProfessionPicker } from './profession'
import { TileEffect } from './tile_effect'
import { LevelMap } from './level_map'
import { Logger } from './logger'
import { Player } from './player'

type MapGenerator = (name: string, game: Game) => LevelMap

export abstract class Game {
  public logger: Logger
  public currentMap: LevelMap | undefined
  public playerTurn: boolean = false
  public running: boolean = false
  public effect: TileEffect | null = null

  protected maps: Map<string, LevelMap | MapGenerator> = new Map()

  constructor(
    public player: Player,
    public professionPicker: ProfessionPicker
  ) {
    this.logger = new Logger(player)
  }

  public turn(): void {
    if (this.running || (this.player.ai.presenter && !this.effect)) {
      return
    }
    this.running = true

    this.mutexTurn()

    this.running = false
  }

  protected mutexTurn(): void {
    if (this.player.ai.runEvents()) {
      return
    }

    if (!this.currentMap) {
      throw 'mutexTurn: Map is undefined'
    }

    if (this.effect) {
      this.player.rebuildVision(this.currentMap)
      this.effect.patchMemory(this.player.stageMemory(this.currentMap))

      if (this.effect.done()) {
        this.effect.onDone()
        this.effect = null
      }
    } else {
      while (!this.player.dead && !this.playerTurn) {
        this.levelMapTurn()
      }

      this.player.rebuildVision(this.currentMap)
    }
  }

  public getMap(name: string): LevelMap {
    const levelMap = this.maps.get(name)

    if (!levelMap) {
      throw `Map ${name} is not found`
    }

    if (levelMap instanceof LevelMap) {
      return levelMap
    } else if (levelMap instanceof Function) {
      const builtLevelMap = levelMap(name, this)
      this.maps.set(name, builtLevelMap)
      return builtLevelMap
    } else {
      throw `LevelMap with id ${name} is not found`
    }
  }

  public addMap(name: string, generator: MapGenerator): void {
    // TODO: Raise if presence
    this.maps.set(name, generator)
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
      const speed = actor.act(map, this)

      // If they are still on a map
      if (speed && map.creatures.find(creature => actorId === creature.id)) {
        timeline.add(actorId, speed)
      }
    }
  }
}
