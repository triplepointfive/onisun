import { Creature } from './creature'

export enum TileTypes {
  Wall,
  Door,
  Floor,
}

export class Tile {
  public creature?: Creature

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

  private constructor(public key: string, public display: string, private kind: TileTypes) {
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

  public passibleThrough(): boolean {
    return this.kind !== TileTypes.Wall
  }
}

export type LevelMapId = number

export class LevelMap {
  public creatures: Creature[] = []
  public id: LevelMapId
  public readonly width: number
  public readonly height: number

  private static lastId: LevelMapId = 0
  public static getId(): LevelMapId {
    return this.lastId++
  }

  constructor(public map: Tile[][]) {
    this.width  = map[0].length
    this.height = map.length
    this.id = LevelMap.getId()
  }

  public addCreature(creature: Creature) {
    this.creatures.push(creature)
    // TODO fail if taken
    this.at(creature.x, creature.y).creature = creature
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
}
