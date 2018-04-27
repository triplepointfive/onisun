export type Visibility = {
  visible: boolean;
  degree: number;
};

export class Fov<T> {
  private static threshold = 0.1;

  private startx: any;
  private starty: any;
  private radius: any;
  private resistanceMap: any;

  private width: any;
  private height: any;
  private lightMap: Visibility[][] = [];

  constructor(private checkSolid: (tile: T) => boolean) {}

  public build(x: number, y: number, radius: number, map: T[][]): Visibility[][] {
    let visibleMap: Visibility[][] = new Array(map.length);

    this.startx        = x;
    this.starty        = y;
    this.radius        = radius;
    this.resistanceMap = map;

    this.width    = this.resistanceMap[0].length;
    this.height   = this.resistanceMap.length;
    this.lightMap = visibleMap;

    map.forEach((row, i) => {
      visibleMap[i] = new Array(row.length);

      row.forEach((elem, j) => {
        visibleMap[i][j] = { visible: true, degree: 0.1 };
      });
    });

    this.lightMap[y][x] = { visible: true, degree: 1 };

    if (!this.checkSolid(this.resistanceMap[y][x])) {
      [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([dx, dy]) => {
        this.castLight(1, 1.0, 0.0, 0, dx, dy, 0);
        this.castLight(1, 1.0, 0.0, dx, 0, 0, dy);
      });
    }

    return visibleMap;
  }

  private castLight(row: number, start: number, end: number, xx: number, xy: number, yx: number, yy: number) {
    if (start < end) { return; }

    let newStart = 0.0;
    let blocked = false;

    for (let distance = row; distance <= this.radius && !blocked; distance++) {
      let deltaY = -distance;

        for (let deltaX: number = -distance; deltaX <= 0; deltaX++) {
          let currentX = Math.round(this.startx + deltaX * xx + deltaY * xy);
          let currentY = Math.round(this.starty + deltaX * yx + deltaY * yy);
          let leftSlope = (deltaX - 0.5) / (deltaY + 0.5);
          let rightSlope = (deltaX + 0.5) / (deltaY - 0.5);

          if (!(currentX >= 0 && currentY >= 0 && currentX < this.width && currentY < this.height) || start < rightSlope) {
              continue;
          } else if (end > leftSlope) {
              break;
          }

          // check if it's within the lightable area and light if needed
          if (this.rad(deltaX, deltaY) <= this.radius) {
            this.lightMap[currentY][currentX] = {
              visible: true,
              degree: (1 - (this.rad(deltaX, deltaY) / this.radius))
            };
          }

          if (blocked) { // previous cell was a blocking one
              if (this.checkSolid(this.resistanceMap[currentY][currentX])) { // hit a wall
                  newStart = rightSlope;
                  continue;
              } else {
                  blocked = false;
                  start = newStart;
              }
          } else {
              if (this.checkSolid(this.resistanceMap[currentY][currentX]) && distance < this.radius) { // hit a wall within sight line
                  blocked = true;
                  this.castLight(distance + 1, start, leftSlope, xx, xy, yx, yy);
                  newStart = rightSlope;
              }
          }
      }
    }
  }

  private rad(x: number, y: number): number {
    return Math.sqrt(x * x + y * y);
  }
}
