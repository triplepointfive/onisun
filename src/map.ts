import { Creature, CreatureId } from './creature'
import { Mapped, Point } from './utils'
import { Timeline } from './timeline'
import { Game } from './game'
import { Tile } from './tile'

import { remove } from 'lodash'
import { Effect } from './engine'

export type LevelMapId = number

export type TimeEvent = [CreatureId, Effect]

export class LevelMap extends Mapped<Tile> {
  public creatures: Creature[] = []
  public id: LevelMapId
  public game: Game
  protected timeline: Timeline<TimeEvent>

  private static lastId: LevelMapId = 0
  public static getId(): LevelMapId {
    return this.lastId++
  }

  constructor(map: Tile[][]) {
    super(map)
    this.id = LevelMap.getId()
    this.timeline = new Timeline()
  }

  public reset(): void {
    this.timeline = new Timeline()
  }

  public leave(actor: Creature): void {
    this.reset()
    this.removeCreature(actor)
  }

  public enter(actor: Creature, enterPos: Point): void {
    this.reset()
    this.creatures.forEach(creature =>
      this.timeline.add([creature.id, undefined], creature.speed())
    )

    actor.addToMap(enterPos, this)
  }

  public addCreature(creature: Creature) {
    this.creatures.push(creature)
    // TODO fail if taken
    this.at(creature.pos.x, creature.pos.y).creature = creature
    this.timeline.add([creature.id, undefined], creature.speed())
  }

  public removeCreature(creature: Creature) {
    let tile = this.at(creature.pos.x, creature.pos.y)
    tile.creature = undefined
    remove(this.creatures, c => c.id === creature.id)
    this.timeline.remove([creature.id, undefined])
  }

  public visibleThrough(x: number, y: number): boolean {
    return this.map[x][y].visibleThrough()
  }

  public passibleThrough(x: number, y: number): boolean {
    return this.map[x][y].passibleThrough()
  }

  public setTile(x: number, y: number, tile: Tile): void {
    this.map[x][y] = tile
  }

  public addEffect(effect: Effect): void {
    this.timeline.add([undefined, effect], effect.speed())
  }

  public turn(): void {
    const [actorId, effect] = this.timeline.next()

    if (actorId !== undefined) {
      const actor = this.creatures.find(creature => actorId === creature.id)

      if (actor) {
        actor.act(this)

        // If they are still on a map
        if (this.creatures.find(creature => actorId === creature.id)) {
          this.timeline.add([actorId, undefined], actor.speed())
        }
      }

      this.game.player.rebuildVision()
    } else if (effect) {
      if (effect.done()) {
        effect.onDone()
      } else {
        this.timeline.add([undefined, effect], effect.speed())
      }

      this.game.player.rebuildVision()
      effect.patchMemory(this.game.player.stageMemory())
    } else {
      throw 'Timeline event is empty!'
    }
  }
}
