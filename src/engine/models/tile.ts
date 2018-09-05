import { Creature } from './creature'
import { Point } from '../utils/utils'
import { LevelMap, LevelMapId } from './level_map'
import { Item } from './items'
import { Game } from './game'
import { ItemsBunch } from '../lib/bunch'

export enum TileTypes {
  Wall,
  Door,
  Floor,
  StairwayDown,
  StairwayUp,
  Trap,
  Trigger,
}

export abstract class Tile {
  public creature?: Creature
  public items: ItemsBunch<Item> | undefined

  constructor(public key: string, public kind: TileTypes) {}

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
      tile.creature = this.creature
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

export abstract class Stairway extends Tile {
  public enterPos: Point | undefined

  constructor(
    key: string,
    type: TileTypes,
    public currentMap: LevelMap,
    public adjacentMapId: LevelMapId
  ) {
    super(key, type)
  }

  public visibleThrough(): boolean {
    return true
  }
}

export class StairwayDown extends Stairway {
  constructor(currentMap: LevelMap, adjacentMapId: LevelMapId) {
    super('>', TileTypes.StairwayDown, currentMap, adjacentMapId)
  }

  public visit(tileVisitor: TileVisitor): void {
    tileVisitor.onStairwayDown(this)
  }

  protected buildNew(): Tile {
    return new StairwayDown(this.currentMap, this.adjacentMapId)
  }
}

export class StairwayUp extends Stairway {
  constructor(currentMap: LevelMap, adjacentMapId: LevelMapId) {
    super('<', TileTypes.StairwayUp, currentMap, adjacentMapId)
  }

  public visit(tileVisitor: TileVisitor): void {
    tileVisitor.onStairwayUp(this)
  }

  protected buildNew(): Tile {
    return new StairwayUp(this.currentMap, this.adjacentMapId)
  }
}

export abstract class Trap extends Tile {
  constructor(public revealed: boolean = false, public readonly type: number) {
    super('^', TileTypes.Trap)
  }

  public visit(tileVisitor: TileVisitor): void {
    tileVisitor.onTrap(this)
  }

  public activate(game: Game, levelMap: LevelMap, actor: Creature): void {
    this.affect(game, levelMap, actor)
  }

  protected abstract affect(
    game: Game,
    levelMap: LevelMap,
    actor: Creature
  ): void
}

export abstract class TriggerTile extends Tile {
  constructor(public singleUse: boolean = true, public tile: Tile) {
    super('T', TileTypes.Trigger)
  }

  public visit(tileVisitor: TileVisitor): void {
    tileVisitor.onTrigger(this)
  }

  public activate(game: Game, levelMap: LevelMap, actor: Creature): void {
    if (this.singleUse) {
      const { x, y } = levelMap.creaturePos(actor)
      const tile = this.clone()
      tile.creature = actor
      levelMap.setTile(x, y, tile)
    }

    this.onTrigger(game, levelMap, actor)
  }

  public buildNew(): Tile {
    return this.tile.clone()
  }

  protected abstract onTrigger(game: Game, levelMap: LevelMap, actor: Creature): void
}

export class LogMessageTrigger extends TriggerTile {
  constructor(private message: string, singleUse: boolean = true, tile: Tile) {
    super(singleUse, tile)
  }

  protected onTrigger(game: Game): void {
    game.logger.info(this.message)
  }
}

// TODO: Add return type?
export abstract class TileVisitor {
  public onWall(wall: Wall): void {
    this.default(wall)
  }

  public onFloor(floor: Floor): void {
    this.default(floor)
  }

  public onStairwayDown(stairway: StairwayDown): void {
    this.onStairway(stairway)
  }

  public onStairwayUp(stairway: StairwayUp): void {
    this.onStairway(stairway)
  }

  public onDoor(door: Door): void {
    this.default(door)
  }

  public onTrigger(trigger: TriggerTile): void {
    this.default(trigger)
  }

  public onTrap(trap: Trap): void {
    this.default(trap)
  }

  protected onStairway(stairway: Stairway): void {
    this.default(stairway)
  }

  protected default(tile: Tile): void {}
}
