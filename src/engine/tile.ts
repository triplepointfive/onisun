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

export abstract class Tile {
  public creature?: Phantom
  public items: ItemsBunch

  constructor(
    public key: string,
    public kind: TileTypes
  ) {}

  public addItem(item: Item, count: number): void {
    if (!this.items) {
      this.items = new ItemsBunch()
    }

    this.items.put(item, count)
  }

  public isFloor(): boolean {
    return this.kind === TileTypes.Floor
  }

  public visibleThrough(): boolean {
    return true
  }

  public passibleThrough(actor?: Creature): boolean {
    if (actor && this.creature) {
      return this.kind !== TileTypes.Wall && this.creature.id === actor.id
    }

    return this.kind !== TileTypes.Wall && !this.creature
  }

  public abstract visit(tileVisitor: TileVisitor): void

  public clone(): Tile {
    let tile = this.buildNew()

    if (this.creature) {
      tile.creature = this.creature.clone()
    }
    tile.items = this.items && this.items.clone()
    return tile
  }

  protected abstract buildNew(): Tile
}

export class Floor extends Tile {
  public visibleThrough(): boolean {
    return true
  }

  public visit(tileVisitor: TileVisitor): void {
    tileVisitor.onFloor(this)
  }

  protected buildNew(): Tile {
    return new Floor(this.key, this.kind)
  }
}

export class Corridor extends Floor {}

export class Room extends Floor {
  constructor() {
    super('R', TileTypes.Floor)
  }
}

export class Door extends Tile {
  constructor() {
    super('D', TileTypes.Door)
  }

  public visibleThrough(): boolean {
    return false
  }

  public visit(tileVisitor: TileVisitor): void {
    tileVisitor.onDoor(this)
  }

  protected buildNew(): Tile {
    return new Door()
  }
}

export class Wall extends Tile {
  constructor() {
    super('W', TileTypes.Wall)
  }

  public visibleThrough(): boolean {
    return false
  }

  public visit(tileVisitor: TileVisitor): void {
    tileVisitor.onWall(this)
  }

  protected buildNew(): Tile {
    return new Wall()
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

  public visibleThrough(): boolean {
    return true
  }
}

export class StairwayDown extends Stairway {
  constructor(public currentMap: LevelMap, public adjacentMapId: LevelMapId) {
    super('>', TileTypes.StairwayDown)
  }

  public visit(tileVisitor: TileVisitor): void {
    tileVisitor.onStairwayDown(this)
  }

  protected buildNew(): Tile {
    return new StairwayDown(this.currentMap, this.adjacentMapId)
  }
}

export class StairwayUp extends Stairway {
  constructor(public currentMap: LevelMap, public adjacentMapId: LevelMapId) {
    super('<', TileTypes.StairwayUp)
  }

  public visit(tileVisitor: TileVisitor): void {
    tileVisitor.onStairwayUp(this)
  }

  protected buildNew(): Tile {
    return new StairwayUp(this.currentMap, this.adjacentMapId)
  }
}

// export abstract class Trap extends Tile {
//   constructor() {
//     super('^', '^', TileTypes.Trap)
//   }
// }
//
// export class FireTrap extends Trap {
//
// }
//
// export class IceTrap extends Trap {
//
// }

export abstract class TileVisitor {
  public onWall(wall: Wall): void {
    this.default(wall)
  }

  public onFloor(floor: Floor): void {
    this.default(floor)
  }

  public onStairwayDown(stairway: StairwayDown): void {
    this.default(stairway)
  }

  public onStairwayUp(stairway: StairwayUp): void {
    this.default(stairway)
  }

  public onDoor(door: Door): void {
    this.default(door)
  }

  protected default(tile: Tile): void {}
}
