export enum TileTypes {
  Wall,
  Door,
  Floor,
}

export class Tile {
  private static repository: { [key: string]: Tile } = {}

  private static register(key: string, tile: Tile) {
    if (this.repository[key]) {
      throw `Tile '${key}' is already registered!`
    }

    this.repository[key] = tile
  }

  public static retrive(key: string): Tile {
    let tile = this.repository[key]

    if (!tile) {
      throw `Tile '${key}' is not registered!`
    }

    return tile
  }

  // TODO: rename type to kind
  constructor(public key: string, public display: string, public type: TileTypes) {
    Tile.register(key, this)
  }

  public visibleThrough(): boolean {
    return this.type === TileTypes.Floor
  }

  public passibleThrough(): boolean {
    return this.type !== TileTypes.Wall
  }
}

new Tile('R', ' ', TileTypes.Floor)
new Tile('C', ' ', TileTypes.Floor)
new Tile('W', '#', TileTypes.Wall)
new Tile('D', '+', TileTypes.Door)

export class LevelMap {
  public readonly width: number
  public readonly height: number

  constructor(public map: Tile[][]) {
    this.width  = map[0].length
    this.height = map.length
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
}
