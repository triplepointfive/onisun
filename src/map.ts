import { Phantom, Creature } from './creature'
import { Item, Corpse } from './items'
import { Point, Mapped } from './utils'
import { Logger } from './logger'

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
    let tile = this.repository[key]

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
    private kind: TileTypes,
  ) {
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
      return (this.kind !== TileTypes.Wall) && this.creature.id === actor.id
    }

    return (this.kind !== TileTypes.Wall) && (!this.creature)
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

  private static lastId: LevelMapId = 0
  public static getId(): LevelMapId {
    return this.lastId++
  }

  constructor(map: Tile[][]) {
    super(map)
    this.id = LevelMap.getId()
    this.logger = new Logger()
  }

  public addCreature(creature: Creature) {
    this.creatures.push(creature)
    // TODO fail if taken
    this.at(creature.pos.x, creature.pos.y).creature = creature
  }

  public removeCreature(creature: Creature) {
    let tile = this.at(creature.pos.x, creature.pos.y)
    tile.creature = undefined
    tile.items.push(new Corpse(creature))
    remove(this.creatures, c => c.id === creature.id)
  }

  public visibleThrough(x: number, y: number): boolean {
    return this.map[y][x].visibleThrough()
  }

  public passibleThrough(x: number, y: number): boolean {
    return this.map[y][x].passibleThrough()
  }

  public at(x, y): Tile {
    return this.map[y][x]
  }

  public setTile(x, y, tile: Tile): void {
    this.map[y][x] = tile
  }

  public inRange(point: Point): boolean {
    return point.x >= 0         && point.y >= 0
        && point.x < this.width && point.y < this.height
  }

  public turn(): void {
    this.creatures.forEach((creature) => creature.act(this))
    this.creatures.forEach((creature) => creature.visionMask(this))
  }
}