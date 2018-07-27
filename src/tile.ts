import { Phantom, Creature } from './creature'
import { Item } from './items'
import { Point } from './utils'
import { LevelMap } from './map'
import { ItemsBunch } from './items/internal';

export enum TileTypes {
  Wall,
  Door,
  Floor,
  StairwayDown,
  StairwayUp,
}

export class Tile {
  public creature?: Phantom
  public items: ItemsBunch

  private static repository: { [key: string]: Tile } = {}

  public static retrieve(key: string): Tile {
    switch (key) {
      case 'R':
        return new Tile('R', ' ', TileTypes.Floor)
      case 'C':
        return new Tile('C', ' ', TileTypes.Floor)
      case 'W':
        return new Tile('W', '#', TileTypes.Wall)
      case 'D':
        return new Tile('D', '+', TileTypes.Door)
      case '>':
        return new Tile('>', '>', TileTypes.StairwayDown)
      case '<':
        return new Tile('<', '<', TileTypes.StairwayUp)
      default:
        throw `Tile '${key}' is not registered!`
    }
  }

  protected constructor(
    public key: string,
    public display: string,
    public kind: TileTypes
  ) {}

  public addItem(item: Item, count: number): void {
    if (!this.items) {
      this.items = new ItemsBunch()
    }

    this.items.put(item, count)
  }

  public isDoor(): boolean {
    return this.kind === TileTypes.Door
  }

  public isWall(): boolean {
    return this.kind === TileTypes.Wall
  }

  public isFloor(): boolean {
    return this.kind === TileTypes.Floor
  }

  public isStairway(): boolean {
    return this.kind === TileTypes.StairwayDown || this.kind === TileTypes.StairwayUp
  }

  public visibleThrough(): boolean {
    return (
      this.isFloor() ||
      this.kind === TileTypes.StairwayDown ||
      this.kind === TileTypes.StairwayUp
    )
  }

  public passibleThrough(actor?: Creature): boolean {
    if (actor && this.creature) {
      return this.kind !== TileTypes.Wall && this.creature.id === actor.id
    }

    return this.kind !== TileTypes.Wall && !this.creature
  }

  public clone(): Tile {
    let tile = Tile.retrieve(this.key)
    if (this.creature) {
      tile.creature = this.creature.clone()
    }
    tile.items = this.items && this.items.clone()
    return tile
  }

  protected uniq(): boolean {
    return this.creature !== undefined
  }
}

abstract class Stairway extends Tile {
  protected currentMap: LevelMap
  protected adjacentMap: LevelMap
  protected enterPos: Point

  public go(actor: Creature): void {
    this.currentMap.leave(actor)
    this.adjacentMap.enter(actor, this.enterPos)

    this.adjacentMap.game.currentMap = this.adjacentMap
  }
}

export class StairwayDown extends Stairway {
  constructor(
    protected currentMap: LevelMap,
    protected adjacentMap: LevelMap,
    protected enterPos: Point
  ) {
    super('>', '>', TileTypes.StairwayDown)
  }
}

export class StairwayUp extends Stairway {
  constructor(
    protected currentMap: LevelMap,
    protected adjacentMap: LevelMap,
    protected enterPos: Point
  ) {
    super('<', '<', TileTypes.StairwayUp)
  }
}
