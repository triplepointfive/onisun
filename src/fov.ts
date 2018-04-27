export type Visibility = {
  visible: boolean;
  degree: number;
};

export class Fov<T> {
  constructor(private checkSolid: (tile: T) => boolean) {}

  public check(x: number, y: number, radius: number, map: T[][]): Visibility[][] {
    let visibleMap: Visibility[][] = new Array(map.length);

    const doubleRadius = radius * radius;

    map.forEach((row, j) => {
      visibleMap[j] = new Array(row.length);

      row.forEach((elem, i) => {
        const distance = (x - i) * (x - i) + (y - j) * (y - j);

        if (distance < doubleRadius ) {
          visibleMap[j][i] = { visible: true, degree: 1 - distance / doubleRadius };
        } else {
          visibleMap[j][i] = { visible: false, degree: 0 };
        }
      });
    });

    return visibleMap;
  }
}
