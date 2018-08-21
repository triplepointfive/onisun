import { Rect, Point, rand, twoDimArray } from '../utils/utils'
import { min } from 'lodash'

const THICKNESS = 0
const RAY_TURNS = 60
const DELTA_ANGLE = Math.PI / (RAY_TURNS * 2)

class Room<T> extends Rect {
  notCross(rect: Rect): boolean {
    return (
      rect.x - THICKNESS > this.x + this.w ||
      rect.y - THICKNESS > this.y + this.h ||
      rect.x + rect.w < this.x - THICKNESS ||
      rect.y + rect.h < this.y - THICKNESS
    )
  }

  pointWithin(): Point {
    return new Point(
      this.x + 1 + rand(this.w - 1),
      this.y + 1 + rand(this.h - 1)
    )
  }

  add(stage: T[][], walls: boolean[][], newRoomSpace: () => T): void {
    let i: number = 0
    while (i < this.w) {
      let j: number = 0
      while (j < this.h) {
        stage[this.x + i][this.y + j] = newRoomSpace()
        walls[this.x + i][this.y + j] = false
        j++
      }

      i++
    }
  }
}

class Road<T> extends Rect {
  lined: boolean

  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h)
    this.lined = (x >= w && y >= h) || (w >= x && h >= y)
  }

  add(stage: T[][], walls: boolean[][], newCorridor: () => T): void {
    let [hx, hy, w] = this.horizontalLine()

    let i = 0
    while (i < w) {
      if (walls[hx + i][hy]) {
        stage[hx + i][hy] = newCorridor()
      }
      i += 1
    }

    let [vx, vy, h] = this.verticalLine()
    let j = 0
    while (j < h) {
      if (walls[vx][vy + j]) {
        stage[vx][vy + j] = newCorridor()
      }
      j += 1
    }
  }

  horizontalLine(): [number, number, number] {
    // x
    // |\
    // .-x
    if (this.lined)
      return [
        Math.min(this.x, this.w),
        Math.max(this.y, this.h),
        Math.abs(this.w - this.x),
      ]
    // .-x
    // |/
    // x
    else
      return [
        Math.min(this.x, this.w),
        Math.min(this.y, this.h),
        Math.abs(this.w - this.x),
      ]
  }

  verticalLine(): [number, number, number] {
    // x
    // |\
    // .-x
    if (this.lined)
      return [
        Math.min(this.x, this.w),
        Math.min(this.y, this.h),
        Math.abs(this.h - this.y),
      ]
    // .-x
    // |/
    // x
    else
      return [
        Math.min(this.x, this.w),
        Math.min(this.y, this.h),
        Math.abs(this.h - this.y),
      ]
  }
}

class DungeonGenerator<T> {
  rooms: Room<T>[]
  roads: Road<T>[]

  constructor(
    protected maxX: number,
    protected maxY: number,
    private minSize: number,
    private maxSize: number,
    private roomsCount: number
  ) {
    let rooms: Room<T>[] = new Array(this.roomsCount)
      .fill(undefined)
      .map(_ => this.generateRoom())

    this.rooms = this.normalize(this.ray(rooms))
    this.roads = this.buildRoads(this.rooms)
  }

  private generateRoom(): Room<T> {
    return new Room(
      0,
      0,
      this.minSize + rand(this.maxSize - this.minSize),
      this.minSize + rand(this.maxSize - this.minSize)
    )
  }

  // Takes a room and tries to put it on a ray coming from (0, 0)
  // until the room finds empty place for it.
  private ray(rooms: Room<T>[]): Room<T>[] {
    return rooms.reduce((pickedRooms: Room<T>[], currentRoom: Room<T>) => {
      for (
        let i = 0, angle = (rand(360) / 180) * Math.PI;
        i < RAY_TURNS;
        angle += DELTA_ANGLE, i++
      ) {
        // TODO: Build table with these values.
        const cos: number = Math.cos(angle)
        const sin: number = Math.sin(angle)
        let l: number = 1
        let dx: number = 0
        let dy: number = 0

        let roomToMove = new Room(
          currentRoom.x,
          currentRoom.y,
          currentRoom.w,
          currentRoom.h
        )

        while (Math.abs(dx) < this.maxX / 2 && Math.abs(dy) < this.maxY / 2) {
          let ndx = Math.round(l * cos)
          let ndy = Math.round(l * sin)

          while (ndx === dx && ndy === dy) {
            l += 1
            ndx = Math.round(l * cos)
            ndy = Math.round(l * sin)
          }

          roomToMove.move(ndx - dx, ndy - dy)
          dx = ndx
          dy = ndy

          if (pickedRooms.every(room => roomToMove.notCross(room))) {
            pickedRooms.push(roomToMove)
            return pickedRooms
          }
        }
      }

      return pickedRooms
    }, [])
  }

  private normalize(rooms: Room<T>[]): Room<T>[] {
    const minX = min(rooms.map(room => room.x)) - 1
    rooms.forEach(room => {
      room.move(-minX, 0)
    })
    rooms = rooms.filter((room: Room<T>) => room.x + room.w < this.maxX)

    const minY = min(rooms.map(room => room.y)) - 1
    rooms.forEach(room => {
      room.move(0, -minY)
    })
    return rooms.filter((room: Room<T>) => room.y + room.h < this.maxY)
  }

  private buildRoads(rooms: Room<T>[]): Road<T>[] {
    let points: Point[] = rooms.map(room => {
      return room.pointWithin()
    })

    let connectedPoints: Point[] = [points.shift()]
    let roads: Road<T>[] = []

    const distance = function(point1: Point, point2: Point): number {
      // No need to calc square root since it's being used for comparison only.
      return (point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2
    }

    while (points.length) {
      let currentPoint = points.shift()

      let pointToConnect = connectedPoints[0]
      let minDistance = distance(currentPoint, pointToConnect)

      connectedPoints.forEach(point => {
        const currentDistance = distance(point, currentPoint)
        if (currentDistance < minDistance) {
          pointToConnect = point
          minDistance = currentDistance
        }
      })

      connectedPoints.push(currentPoint)

      roads.push(
        new Road(
          currentPoint.x,
          currentPoint.y,
          pointToConnect.x,
          pointToConnect.y
        )
      )
    }

    return roads
  }
}

export default function<T>(
  dimX: number,
  dimY: number,
  minSize: number,
  maxSize: number,
  roomsCount: number,
  newRoomSpace: () => T,
  newCorridor: () => T,
  newWall: () => T
): T[][] {
  // TODO: Validate min or max size is lower than map's sizes
  const dungeon = new DungeonGenerator<T>(
    dimX,
    dimY,
    minSize,
    maxSize,
    roomsCount
  )

  let stage = twoDimArray(dimX, dimY, newWall)
  let walls = twoDimArray(dimX, dimY, () => true)

  for (let i = 0; i < dungeon.rooms.length; i++)
    dungeon.rooms[i].add(stage, walls, newRoomSpace)
  for (let i = 0; i < dungeon.roads.length; i++)
    dungeon.roads[i].add(stage, walls, newCorridor)

  return stage
}
