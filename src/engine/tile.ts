import { Phantom, Creature } from './creature'
import { Item } from './items'
import { Point } from './utils'
import { LevelMap, LevelMapId } from './level_map'
import { ItemsBunch } from './items/internal'

export enum TileTypes {
  Wall,
  Door,
  Floor,
  StairwayDown,
  StairwayUp,
  Trap,
}

export class Tile {
  public creature?: Phantom
  public items: ItemsBunch

  constructor(
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
    return (
      this.kind === TileTypes.StairwayDown || this.kind === TileTypes.StairwayUp
    )
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
    let tile = new Tile(this.key, this.display, this.kind)

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
  public currentMap: LevelMap
  public adjacentMapId: LevelMapId
  public enterPos: Point

  public go(actor: Creature): void {
    this.currentMap.leave(actor)

    // TODO: Do not do this if already connected
    const adjacentMap = this.currentMap.game.getMap(this.adjacentMapId)
    this.enterPos = adjacentMap.matchStairs(this.currentMap.id, actor.pos)

    adjacentMap.enter(actor, this.enterPos)
    adjacentMap.game.currentMap = adjacentMap
  }
}

export class StairwayDown extends Stairway {
  constructor(public currentMap: LevelMap, public adjacentMapId: LevelMapId) {
    super('>', '>', TileTypes.StairwayDown)
  }
}

export class StairwayUp extends Stairway {
  constructor(public currentMap: LevelMap, public adjacentMapId: LevelMapId) {
    super('<', '<', TileTypes.StairwayUp)
  }
}

export abstract class Trap extends Tile {
  constructor() {
    super('^', '^', TileTypes.Trap)
  }
}

export class FireTrap extends Trap {

}

export class IceTrap extends Trap {

}
