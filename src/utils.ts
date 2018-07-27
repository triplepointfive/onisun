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

export const bresenham = function(
  p0: Point,
  p1: Point,
  on: (x, y) => void
): void {
  let [x0, x1, y0, y1] = [p0.x, p1.x, p0.y, p1.y]
  let steps = Math.max(Math.abs(x0 - x1), Math.abs(y0 - y1))
  const delta = new Point((x1 - x0) / steps, (y1 - y0) / steps)

  while (steps > 1) {
    x0 += delta.x
    y0 += delta.y

    on(Math.round(x0), Math.round(y0))

    steps -= 1
  }
}

export class Direction extends Point {
  private constructor(x, y) {
    super(x, y)
  }

  static readonly up = new Direction(0, -1)
  static readonly down = new Direction(0, 1)
  static readonly left = new Direction(-1, 0)
  static readonly right = new Direction(1, 0)

  static readonly upLeft = new Direction(-1, -1)
  static readonly upRight = new Direction(1, -1)
  static readonly downLeft = new Direction(-1, 1)
  static readonly downRight = new Direction(1, 1)
}
