import { Rect, Point, rand, min, twoDimArray } from '../utils'
import { LevelMap, Tile } from '../onisun'

const THICKNESS = 0

const newRoomSpace = function(): Tile {
  return Tile.retrieve('R')
}

const newCorridor = function(): Tile {
  return Tile.retrieve('C')
}

const newWall = function(): Tile {
  return Tile.retrieve('W')
}

type Stage = Tile[][]

const RAY_TURNS = 60
const DELTA_ANGLE = Math.PI / (RAY_TURNS * 2)

class Room extends Rect {
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

  add(stage: Stage): void {
    let i: number = 0
    while (i < this.w) {
      let j: number = 0
      while (j < this.h) {
        stage[this.x + i][this.y + j] = newRoomSpace()
        j++
      }

      i++
    }
  }
}

class Road extends Rect {
  lined: boolean

  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h)
    this.lined = (x >= w && y >= h) || (w >= x && h >= y)
  }

  add(stage: Stage): void {
    let [hx, hy, w] = this.horizontalLine()

    let i = 0
    while (i < w) {
      if (stage[hx + i][hy].key === 'W') {
        stage[hx + i][hy] = newCorridor()
      }
      i += 1
    }

    let [vx, vy, h] = this.verticalLine()
    let j = 0
    while (j < h) {
      if (stage[vx][vy + j].key === 'W') {
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

class DungeonGenerator {
  rooms: Array<Room>
  roads: Array<Road>

  constructor(
    protected maxX: number,
    protected maxY: number,
    private minSize: number,
    private maxSize: number,
    private roomsCount: number
  ) {
    let rooms: Room[] = new Array(this.roomsCount).fill(undefined).map(_ => this.generateRoom())

    this.rooms = this.normalize(this.ray(rooms))
    this.roads = this.buildRoads(this.rooms)
  }

  private generateRoom(): Room {
    return new Room(
      0,
      0,
      this.minSize + rand(this.maxSize - this.minSize),
      this.minSize + rand(this.maxSize - this.minSize)
    )
  }

  // Takes a room and tries to put it on a ray coming from (0, 0)
  // until the room finds empty place for it.
  private ray(rooms: Room[]): Room[] {
    return rooms.reduce((pickedRooms: Room[], currentRoom: Room) => {
      for (let i = 0, angle = (rand(360) / 180) * Math.PI; i < RAY_TURNS; angle += DELTA_ANGLE, i++) {
        // TODO: Build table with these values.
        const cos: number = Math.cos(angle)
        const sin: number = Math.sin(angle)
        let l: number = 1
        let dx: number = 0
        let dy: number = 0

        let roomToMove = new Room(currentRoom.x, currentRoom.y, currentRoom.w, currentRoom.h)

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

  private normalize(rooms: Room[]): Room[] {
    const minX = min(rooms.map(room => room.x)) - 1
    rooms.forEach(room => { room.move(-minX, 0) })
    rooms = rooms.filter((room: Room) => room.x + room.w < this.maxX)

    const minY = min(rooms.map(room => room.y)) - 1
    rooms.forEach(room => { room.move(0, -minY) })
    return rooms.filter((room: Room) => room.y + room.h < this.maxY)
  }

  private buildRoads(rooms: Room[]): Road[] {
    let points: Point[] = rooms.map(room => {
      return room.pointWithin()
    })

    let connectedPoints: Point[] = [points.shift()]
    let roads: Road[] = []

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

export default function(
  dimX: number,
  dimY: number,
  minSize: number,
  maxSize: number,
  roomsCount: number,
): LevelMap {
  // TODO: Validate min or max size is lower than map's sizes
  const dungeon = new DungeonGenerator(dimX, dimY, minSize, maxSize, roomsCount)

  let stage = twoDimArray(dimX, dimY, newWall)

  for (let i = 0; i < dungeon.rooms.length; i++) dungeon.rooms[i].add(stage)

  for (let i = 0; i < dungeon.roads.length; i++) dungeon.roads[i].add(stage)

  return new LevelMap(stage)
}
