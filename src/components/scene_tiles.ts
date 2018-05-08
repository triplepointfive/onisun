import { Tile } from '../../vendor/unicodetiles.ts/src/index'

const DEFAULT_GREY: number = 120
const IMPORTANT_GREY: number = 180
const DEFAULT_LIT = { r: 255, g: 165, b: 0 }

class DisplayTile extends Tile {
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
