import { Logger, LevelMap, Player, Presenter, LevelMapId } from '../engine'
import { ProfessionPicker } from './profession'
import { MetaAI } from './ai/meta_ai'
import { Effect } from './effect';

type MapGenerator = (id: LevelMapId, game: Game) => LevelMap

export abstract class Game {
  public logger: Logger = new Logger()
  public currentMap: LevelMap
  public player: Player
  public ai: MetaAI
  public screen: Presenter = null
  public running: boolean = false
  public professionPicker: ProfessionPicker

  protected maps: Map<LevelMapId, LevelMap | MapGenerator> = new Map()

  public turn() {
    if (this.running || this.screen) {
      return
    }

    this.player.ai.runEvents()

    this.running = true

    while (!this.player.dead && !this.screen) {
      const effect = this.levelMapTurn()

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

  private levelMapTurn(): Effect {
    let timeline = this.currentMap.timeline,
      map = this.currentMap

    const [actorId, effect] = timeline.next()

    if (actorId !== undefined) {
      const actor = map.creatures.find(creature => actorId === creature.id)

      if (actor) {
        actor.act(map)

        // If they are still on a map
        if (map.creatures.find(creature => actorId === creature.id)) {
          timeline.add([actorId, undefined], actor.speed())
        }
      }

      return
    } else if (effect) {
      if (effect.done()) {
        effect.onDone()
      } else {
        timeline.add([undefined, effect], effect.speed())
      }

      return effect
    } else {
      throw 'Timeline event is empty!'
    }
  }
}
