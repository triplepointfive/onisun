import { Point, rand, twoDimArray } from '../utils'
import { Tile } from '../../engine'

const newSpace = function(): Tile {
  return Tile.retrieve('C')
}

const newWall = function(): Tile {
  return Tile.retrieve('W')
}

const generate = function(dimX: number, dimY: number): Tile[][] {
  let level = twoDimArray(dimX, dimY, newWall)
  let freeCellsCount = 1
  let pos = new Point(Math.floor(dimX / 2), Math.floor(dimY / 2))

  const requiredEmptyCells = (dimX * dimY) / 4

  let step = 0
  const maxSteps = dimX * dimY * 10

  while (freeCellsCount < requiredEmptyCells) {
    step += 1
    if (step > maxSteps) {
      throw `Failed to generate map after ${step} steps`
    }

    // TODO check height and widht match
    if (
      pos.x <= 0 ||
      pos.y <= 0 ||
      pos.x >= dimX - 1 ||
      pos.y >= dimY - 1
    ) {
      pos = new Point(Math.floor(dimX / 2), Math.floor(dimY / 2))
      continue
    }

    if (level[pos.x][pos.y].isWall()) {
      level[pos.x][pos.y] = newSpace()
      freeCellsCount += 1
    }

    switch (rand(4)) {
      case 0:
        pos.y -= 1
        break
      case 1:
        pos.x -= 1
        break
      case 2:
        pos.y += 1
        break
      case 3:
        pos.x += 1
        break
    }
  }

  return level
}

export { generate }
