import { Tile } from '../vendor/unicodetiles.ts/src/index'

import {
  Item,
  ItemGroup,
} from '../src/engine'

const DEFAULT_GREY: number = 120
const IMPORTANT_GREY: number = 180
const DEFAULT_LIT = { r: 255, g: 165, b: 0 }

export class DisplayTile extends Tile {
  public lighted(degree: number): Tile {
    return this
  }

  constructor(char: string, r = DEFAULT_GREY, g = DEFAULT_GREY, b = DEFAULT_GREY) {
    super(char, r, g, b)
  }

  protected litBackground(tile: Tile, degree: number): Tile {
    tile.setBackground(
      DEFAULT_LIT.r * degree,
      DEFAULT_LIT.g * degree,
      DEFAULT_LIT.b * degree,
    )
    return tile
  }

  protected litColor(tile: Tile, degree: number): Tile {
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

export class StairwayDown extends DisplayTile {
  constructor() {
    super('＞')
  }
}

export class StairwayUp extends DisplayTile {
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
    default:
      throw `Unknown group ${item} with type ${item.group}`
  }
}
