import { Phantom, Creature, CreatureId } from './creature'
import { Item, Corpse } from './items'
import { Point, Mapped } from './utils'
import { Logger } from './logger'
import { Timeline } from './timeline'

import { includes } from 'lodash'

export enum TileTypes {
  Wall,
  Door,
  Floor,
}

import { remove } from 'lodash'

export class Tile {
  public creature?: Phantom
  public items: Item[] = []

  private static repository: { [key: string]: Tile } = {}

  public static retrive(key: string): Tile {
    switch (key) {
      case 'R':
        return new Tile('R', ' ', TileTypes.Floor)
      case 'C':
        return new Tile('C', ' ', TileTypes.Floor)
      case 'W':
        return new Tile('W', '#', TileTypes.Wall)
      case 'D':
        return new Tile('D', '+', TileTypes.Door)
      default:
        throw `Tile '${key}' is not registered!`
    }
  }

  private constructor(
    public key: string,
    public display: string,
    private kind: TileTypes
  ) {}

  public addItem(item: Item): void {
    this.items.push(item)
  }

  public isDoor(): boolean {
    return this.kind === TileTypes.Door
  }

  public isWall(): boolean {
    return this.kind === TileTypes.Wall
  }

  public visibleThrough(): boolean {
    return this.kind === TileTypes.Floor
  }

  public passibleThrough(actor?: Creature): boolean {
    if (actor && this.creature) {
      return this.kind !== TileTypes.Wall && this.creature.id === actor.id
    }

    return this.kind !== TileTypes.Wall && !this.creature
  }

  public clone(): Tile {
    let tile = Tile.retrive(this.key)
    if (this.creature) {
      tile.creature = this.creature.clone()
    }
    this.items.forEach(item => tile.items.push(item.clone()))
    return tile
  }

  protected uniq(): boolean {
    return this.creature !== undefined
  }
}

export type LevelMapId = number

export class LevelMap extends Mapped<Tile> {
  public creatures: Creature[] = []
  public id: LevelMapId
  public logger: Logger
  protected timeline: Timeline<CreatureId>

  private static lastId: LevelMapId = 0
  public static getId(): LevelMapId {
    return this.lastId++
  }

  constructor(map: Tile[][]) {
    super(map)
    this.id = LevelMap.getId()
    this.logger = new Logger()
    this.timeline = new Timeline()
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
    tile.items.push(new Corpse(creature))

    creature.inventory.wears().forEach(({ bodyPart, equipment }) => {
      if (equipment) {
        tile.items.push(equipment)
      }
    })

    creature.inventory.cares().forEach(item => {
      tile.items.push(item)
    })

    remove(this.creatures, c => c.id === creature.id)
    this.timeline.remove(creature.id)
  }

  public visibleThrough(x: number, y: number): boolean {
    return this.map[x][y].visibleThrough()
  }

  public passibleThrough(x: number, y: number): boolean {
    return this.map[x][y].passibleThrough()
  }

  public setTile(x, y, tile: Tile): void {
    this.map[x][y] = tile
  }

  public turn(): void {
    const turnCreatureIds = this.timeline.actors()

    console.time('Creatures AI')

    // First loop to act
    this.creatures.forEach(creature => {
      if (includes(turnCreatureIds, creature.id)) {
        creature.act(this)
      }
    })

    console.timeEnd('Creatures AI')

    // Second loop to add themselves to timeline again
    // and build vision after all actions
    this.creatures.forEach(creature => {
      if (includes(turnCreatureIds, creature.id)) {
        this.timeline.add(creature.id, creature.speed())
      }
      creature.visionMask(this)
    })
  }
}
