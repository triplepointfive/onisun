import { Tile as UniTile } from '../vendor/unicodetiles.ts/src/index'

import {
  Item,
  ItemGroup,
  TileVisitor,

  Wall,
  Floor,
  Tile,
  StairwayDown,
  StairwayUp,
  Door,
  Trap,
  TriggerTile,
  TrapType,
} from '../src/onisun'

const DEFAULT_GREY: number = 120
const IMPORTANT_GREY: number = 180
const DEFAULT_LIT = { r: 255, g: 165, b: 0 }

export class DisplayTile extends UniTile {
  public lighted(degree: number): UniTile {
    return this
  }

  constructor(char: string, r = DEFAULT_GREY, g = DEFAULT_GREY, b = DEFAULT_GREY) {
    super(char, r, g, b)
  }

  protected litBackground(tile: UniTile, degree: number): UniTile {
    tile.setBackground(
      DEFAULT_LIT.r * degree,
      DEFAULT_LIT.g * degree,
      DEFAULT_LIT.b * degree,
    )
    return tile
  }

  protected litColor(tile: UniTile, degree: number): UniTile {
    tile.setColor(
      DEFAULT_LIT.r * degree,
      DEFAULT_LIT.g * degree,
      DEFAULT_LIT.b * degree,
    )
    return tile
  }
}

abstract class ImportantTile extends DisplayTile {
  constructor(char: string) {
    super(char, IMPORTANT_GREY, IMPORTANT_GREY, IMPORTANT_GREY)
  }
}

export class CreatureTile extends ImportantTile {
  constructor(
    char: string,
    public vr: number,
    public vg: number,
    public vb: number,
  ) {
    super(char)
  }

  public lighted(degree: number) {
    let tile = this.clone()
    tile.setColor(this.vr, this.vg, this.vb)

    return tile
  }
}

export class DoorTile extends DisplayTile {
  constructor() {
    super('戸')
  }

  public lighted(degree: number) {
    let tile = this.clone()
    this.litColor(tile, degree)
    tile.swapColors()

    return tile
  }
}

export class FloorTile extends DisplayTile {
  constructor() {
    super('・')
  }

  public lighted(degree: number) {
    return this.litColor(this.clone(), degree)
  }
}

export class WallTile extends DisplayTile {
  constructor() {
    super('＃')
  }

  public lighted(degree: number) {
    let tile = this.clone()
    this.litBackground(tile, degree)
    tile.backgroundToColor()

    return tile
  }
}

export class StairwayDownD extends DisplayTile {
  constructor() {
    super('＞')
  }
}

export class StairwayUpD extends DisplayTile {
  constructor() {
    super('＜')
  }
}

export class ItemTile extends DisplayTile {
  constructor(
    char: string,
    public vr: number,
    public vg: number,
    public vb: number,
  ) {
    super(char)
  }

  public lighted(degree: number) {
    let tile = this.clone()
    tile.setColor(this.vr, this.vg, this.vb)

    return tile
  }
}

const WEAPON = new ItemTile('刀', 200, 200, 200)
const CORPSE = new ItemTile('体', 200, 200, 200)
const BODY_ARMOR = new ItemTile('胸', 200, 200, 200)
const MISSILE = new ItemTile('石', 200, 200, 200)
const MISSILE_WEAPON = new ItemTile(']', 200, 200, 200)
const BOOTS = new ItemTile('[', 255, 255, 0)

const POTION = new ItemTile('！', 200, 200, 200)

export const displayItem = function(item: Item): ItemTile {
  switch (item.group) {
    case ItemGroup.OneHandWeapon:
      return WEAPON
    case ItemGroup.Consumable:
      return CORPSE
    case ItemGroup.BodyArmor:
      return BODY_ARMOR
    case ItemGroup.Missile:
      return MISSILE
    case ItemGroup.MissileWeapon:
      return MISSILE_WEAPON
    case ItemGroup.Potion:
      return POTION
    case ItemGroup.Boots:
      return BOOTS
    default:
      return CORPSE
  }
}

const DOOR = new DoorTile()
const WALL = new WallTile()
const FLOOR = new FloorTile()
const STAIRWAY_DOWN = new StairwayDownD()
const STAIRWAY_UP = new StairwayUpD()
const NULL_TILE = new DisplayTile('　', 0, 0, 0)

const TELEPORTATION_TRAP = new DisplayTile('^', 0, 191, 255)
const LIGHT_TRAP = new DisplayTile('^', 255, 255, 0)
const HOLE_TRAP = new DisplayTile('^', 139, 69, 19)
const BARE_WIRE_TRAP = new DisplayTile('^', 255, 165, 0)

export class DisplayTileVisitor extends TileVisitor {
  public tile: DisplayTile

  public onWall(wall: Wall): void {
    this.tile = WALL
  }

  public onFloor(floor: Floor): void {
    this.tile = FLOOR
  }

  public onStairwayDown(stairway: StairwayDown): void {
    this.tile = STAIRWAY_DOWN
  }

  public onStairwayUp(stairway: StairwayUp): void {
    this.tile = STAIRWAY_UP
  }

  public onDoor(door: Door): void {
    this.tile = DOOR
  }

  public onTrap(trap: Trap): void {
    if (!trap.revealed) {
      trap.tile.visit(this)
      return
    }

    switch (trap.type) {
    case TrapType.Teleportation:
      this.tile = TELEPORTATION_TRAP
      break
    case TrapType.Light:
      this.tile = LIGHT_TRAP
      break
    case TrapType.Hole:
      this.tile = HOLE_TRAP
      break
    case TrapType.BareWire:
      this.tile = BARE_WIRE_TRAP
      break
    }
  }

  public onTrigger(trigger: TriggerTile): void {
    trigger.tile.visit(this)
  }

  protected default(tile: Tile): void {
    this.tile = NULL_TILE
  }
}

const displayTileVisitor = new DisplayTileVisitor()

export const displayTile = function(tile): DisplayTile {
  tile.visit(displayTileVisitor)
  return displayTileVisitor.tile
}
