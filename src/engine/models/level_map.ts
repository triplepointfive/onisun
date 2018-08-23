import { Creature, CreatureId } from './creature'
import { Mapped, Point } from '../utils/utils'
import { Timeline } from '../lib/timeline'
import { Tile, StairwayDown, StairwayUp } from './tile'

import { remove } from 'lodash'

// TODO: Remove map id
export type LevelMapId = number

export class LevelMap extends Mapped<Tile> {
  public creatures: Creature[] = []
  public timeline: Timeline<CreatureId>
  public name: string = 'unnamed'

  constructor(public readonly id: LevelMapId, map: Tile[][]) {
    super(map)
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

  public matchStairs(adjustId: LevelMapId, enterPos: Point): Point {
    let stairPos: Point | undefined

    this.each((tile, x, y) => {
      if (tile instanceof StairwayDown || tile instanceof StairwayUp) {
        if (tile.adjacentMapId === adjustId) {
          tile.enterPos = enterPos
          stairPos = new Point(x, y)
        }
      }
    })

    if (stairPos) {
      return stairPos
    }

    throw `LevelMap ${this.name} failed to find stairs to ${adjustId}`
  }
}
