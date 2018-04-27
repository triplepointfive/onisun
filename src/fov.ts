export type Visibility = {
  visible: boolean;
  degree: number;
};

export class Fov<T> {
  constructor(private checkSolid: (tile: T) => boolean) {}

  public build(x: number, y: number, radius: number, map: T[][]): Visibility[][] {
    let visibleMap: Visibility[][] = new Array(map.length);

    map.forEach((row, i) => {
      visibleMap[i] = new Array(row.length);

      row.forEach((elem, j) => {
        visibleMap[i][j] = { visible: true, degree: 0.1 };
      });
    });

    const doubleRadius = radius * radius,
          xMin         = Math.max(0, x - radius),
          xMax         = Math.min(map.length, x + radius),
          yMin         = Math.max(0, y - radius),
          yMax         = Math.min(map[0].length, y + radius),
          steps        = radius * 2 + 1; // Absolute max of cells a ray may affect

    for (let j: number = xMin; j < xMax; j++) {
      this.los(x, y, (j - x) / steps, (yMin - y) / steps, doubleRadius, map, visibleMap);
      this.los(x, y, (j - x) / steps, (yMax - y) / steps, doubleRadius, map, visibleMap);
    }

    for (let i: number = yMin; i < yMax; i++) {
      this.los(x, y, (xMin - x) / steps, (i - y) / steps, doubleRadius, map, visibleMap);
      this.los(x, y, (xMax - x) / steps, (i - y) / steps, doubleRadius, map, visibleMap);
    }

    return visibleMap;
  }

  private los(x: number, y: number, dx: number, dy: number, doubleRadius: number, map: T[][], visibleMap: Visibility[][]) {
    let currentX = x, currentY = y;
    let distance = 0;

    // TODO: Calc it in a one place
    distance = (x - currentX) * (x - currentX) + (y - currentY) * (y - currentY);

    while (distance <= doubleRadius) {
      const gridX = Math.round(currentX);
      const gridY = Math.round(currentY);

      visibleMap[gridY][gridX].visible = true;
      // TODO: Add min 0?
      visibleMap[gridY][gridX].degree = 1 - distance / doubleRadius * 2;

      if (this.checkSolid(map[gridY][gridX])) {
        break;
      }

      currentX += dx;
      currentY += dy;
      distance = (x - currentX) * (x - currentX) + (y - currentY) * (y - currentY);
    }
  }
}
