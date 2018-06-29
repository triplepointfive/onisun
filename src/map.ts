import { Creature, CreatureId } from './creature'
import { Mapped, Point } from './utils'
import { Timeline } from './timeline'
import { Game } from './game'
import { Tile } from './tile'

import { remove, includes } from 'lodash'

export type LevelMapId = number

export class LevelMap extends Mapped<Tile> {
  public creatures: Creature[] = []
  public id: LevelMapId
  public game: Game
  protected timeline: Timeline<CreatureId>

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
      this.timeline.add(creature.id, creature.speed())
    )

    actor.addToMap(enterPos, this)
  }

  public addCreature(creature: Creature) {
    this.creatures.push(creature)
    // TODO fail if taken
    this.at(creature.pos.x, creature.pos.y).creature = creature
    this.timeline.add(creature.id, creature.speed())
  }

  public removeCreature(creature: Creature) {
    let tile = this.at(creature.pos.x, creature.pos.y)
    tile.creature = undefined
    remove(this.creatures, c => c.id === creature.id)
    this.timeline.remove(creature.id)
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

  public turn(): void {
    const turnCreatureIds = this.timeline.actors()

    // First loop to act
    this.creatures.forEach(creature => {
      if (includes(turnCreatureIds, creature.id)) {
        creature.act(this)
      }
    })

    // Second loop to add themselves to timeline again
    // and build vision after all actions
    this.creatures.forEach(creature => {
      if (includes(turnCreatureIds, creature.id)) {
        this.timeline.add(creature.id, creature.speed())
      }
    })

    this.game.player.rebuildVision()
  }
}
