export class Rect {
  x: number
  y: number
  w: number
  h: number

  constructor( x: number, y: number, w: number, h: number ) {
    // TODO: Validate?
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }

  move( x: number, y: number ): void {
    this.x += x
    this.y += y
  }
}

export const succ = function ( c: string ): string {
  return String.fromCharCode( c.charCodeAt( 0 ) + 1 )
}

export const rand = function ( max: number ): number {
  return Math.floor( Math.random() * max )
}

/* tslint:disable no-any */
export const twoDimArray = function ( dimX: number, dimY: number,
                                      value: ( x: number, y: number ) => any ): Array<Array<any>> {
  let field = Array( dimX )

  let i = 0
  while ( i < dimX ) {
    field[i] = new Array(dimY)
    let j = 0
    while ( j < dimY ) {
      field[i][j] = value( i, j )
      j++
    }
    i++
  }

  return field
}

export const max = function( list: Array< number > ): number {
  return Math.max.apply( Math, list )
}

export const min = function( list: Array< number > ): number {
  return Math.min.apply( Math, list )
}

export class Point {
  constructor(
    public x: number,
    public y: number,
  ) {
  }

  public static readonly dxy = [
    new Point(-1, -1), new Point(0, -1), new Point(1, -1),
    new Point(-1,  0),                   new Point(1,  0),
    new Point(-1,  1), new Point(0,  1), new Point(1,  1),
  ]

  public eq(point: Point): boolean {
    return this.x === point.x && this.y === point.y
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

