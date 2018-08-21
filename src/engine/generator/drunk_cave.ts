import { Point, rand, twoDimArray } from '../utils/utils'

const generate = function<T>(
  dimX: number,
  dimY: number,
  newWall: () => T,
  newSpace: () => T
): T[][] {
  let level = twoDimArray(dimX, dimY, newWall),
    walls = twoDimArray(dimX, dimY, () => true),
    freeCellsCount = 1,
    pos = new Point(Math.floor(dimX / 2), Math.floor(dimY / 2))

  const requiredEmptyCells = (dimX * dimY) / 4

  let step = 0
  const maxSteps = dimX * dimY * 10

  while (freeCellsCount < requiredEmptyCells) {
    step += 1
    if (step > maxSteps) {
      throw `Failed to generate map after ${step} steps`
    }

    // TODO check height and width match
    if (pos.x <= 0 || pos.y <= 0 || pos.x >= dimX - 1 || pos.y >= dimY - 1) {
      pos = new Point(Math.floor(dimX / 2), Math.floor(dimY / 2))
      continue
    }

    if (walls[pos.x][pos.y]) {
      level[pos.x][pos.y] = newSpace()
      walls[pos.x][pos.y] = false
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
