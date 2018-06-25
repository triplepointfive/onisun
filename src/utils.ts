export class Rect {
  // TODO: Validate?
  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number
  ) {}

  move(x: number, y: number): void {
    this.x += x
    this.y += y
  }
}

export const succ = function(c: string): string {
  return String.fromCharCode(c.charCodeAt(0) + 1)
}

export const rand = function(max: number): number {
  return Math.floor(Math.random() * max)
}

/* tslint:disable no-any */
export const twoDimArray = function(
  width: number,
  height: number,
  value: (x: number, y: number) => any
): Array<Array<any>> {
  let field = Array(width)

  for (let i = 0; i < width; i++) {
    field[i] = new Array(height)
    for (let j = 0; j < height; j++) {
      field[i][j] = value(i, j)
    }
  }

  return field
}

export const max = function(list: Array<number>): number {
  return Math.max.apply(Math, list)
}

export const min = function(list: Array<number>): number {
  return Math.min.apply(Math, list)
}

export class Point {
  constructor(public x: number, public y: number) {}

  public static readonly dxy = [
    new Point(-1, -1),
    new Point(0, -1),
    new Point(1, -1),
    new Point(-1, 0),
    new Point(1, 0),
    new Point(-1, 1),
    new Point(0, 1),
    new Point(1, 1),
  ]

  public eq(point: Point): boolean {
    return this.x === point.x && this.y === point.y
  }

  public nextTo(point: Point): boolean {
    return Math.abs(this.x - point.x) <= 1 && Math.abs(this.y - point.y) <= 1
  }

  public copy(): Point {
    return new Point(this.x, this.y)
  }

  public add(point: Point): Point {
    return new Point(this.x + point.x, this.y + point.y)
  }

  public wrappers(): Point[] {
    return Point.dxy.map(point => this.add(point))
  }
}

export abstract class Mapped<T> {
  public readonly width: number
  public readonly height: number

  constructor(public map: T[][]) {
    this.width = map.length
    this.height = map[0].length
  }

  public at(x, y): T {
    return this.map[x][y]
  }

  public inRange(point: Point): boolean {
    return (
      point.x >= 0 &&
      point.y >= 0 &&
      point.x < this.width &&
      point.y < this.height
    )
  }

  public each(on: (T) => any): void {
    this.map.forEach(column => {
      column.forEach(tile => {
        on(tile)
      })
    })
  }
}

export const cycle = function(list: any[], dx: number): any[] {
  let x
  if (dx > 0) {
    for (let i = 0; i < dx; i++) {
      x = list.pop()
      list.unshift(x)
    }
  } else if (dx < 0) {
    for (let i = dx; i < 0; i++) {
      x = list.shift()
      list.push(x)
    }
  }

  return list
}
