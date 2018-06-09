export class Fov {
  private doubleRadius: number

  constructor(
    private startx: number,
    private starty: number,
    private radius: number,
    private width: number,
    private height: number,
    private checkSolid: (x: number, y: number) => boolean,
    private markVisible: (x: number, y: number, degree: number) => void
  ) {
    this.doubleRadius = this.radius * this.radius
  }

  public calc(): void {
    this.markVisible(this.startx, this.starty, 1)

    if (!this.checkSolid(this.startx, this.starty)) {
      ;[[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([dx, dy]) => {
        this.castLight(1, 1.0, 0.0, 0, dx, dy, 0)
        this.castLight(1, 1.0, 0.0, dx, 0, 0, dy)
      })
    }
  }

  private castLight(
    row: number,
    start: number,
    end: number,
    xx: number,
    xy: number,
    yx: number,
    yy: number
  ) {
    if (start < end) {
      return
    }

    let newStart = 0.0
    let blocked = false

    for (let distance = row; distance <= this.radius && !blocked; distance++) {
      let deltaY = -distance

      for (let deltaX: number = -distance; deltaX <= 0; deltaX++) {
        let currentX = Math.round(this.startx + deltaX * xx + deltaY * xy)
        let currentY = Math.round(this.starty + deltaX * yx + deltaY * yy)
        let leftSlope = (deltaX - 0.5) / (deltaY + 0.5)
        let rightSlope = (deltaX + 0.5) / (deltaY - 0.5)

        if (
          !(
            currentX >= 0 &&
            currentY >= 0 &&
            currentX < this.width &&
            currentY < this.height
          ) ||
          start < rightSlope
        ) {
          continue
        } else if (end > leftSlope) {
          break
        }

        // check if it's within the lightable area and light if needed
        if (this.doubleDistance(deltaX, deltaY) <= this.doubleRadius) {
          this.markVisible(
            currentX,
            currentY,
            1 - this.doubleDistance(deltaX, deltaY) / this.doubleRadius
          )
        }

        if (blocked) {
          // previous cell was a blocking one
          if (this.checkSolid(currentX, currentY)) {
            // hit a wall
            newStart = rightSlope
          } else {
            blocked = false
            start = newStart
          }
        } else {
          if (this.checkSolid(currentX, currentY) && distance < this.radius) {
            // hit a wall within sight line
            blocked = true
            this.castLight(distance + 1, start, leftSlope, xx, xy, yx, yy)
            newStart = rightSlope
          }
        }
      }
    }
  }

  private doubleDistance(x: number, y: number): number {
    return x * x + y * y
  }
}
