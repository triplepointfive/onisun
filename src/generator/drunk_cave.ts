import { Point, rand, min, max, twoDimArray } from '../utils'

import { LevelMap, Tile, TileTypes } from '../map'

const THICKNESS = 0

const newSpace = function(): Tile {
  return Tile.retrive('C')
}

const newWall = function(): Tile {
  return Tile.retrive('W')
}

const generate = function(
  dimX: number,
  dimY: number,
  minSize: number = 5,
  maxSize: number = 5,
  roomsCount: number = 3
): LevelMap {
  let level = new LevelMap(twoDimArray(dimX, dimY, newWall))
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
      pos.x >= level.width - 1 ||
      pos.y >= level.height - 1
    ) {
      pos = new Point(Math.floor(dimX / 2), Math.floor(dimY / 2))
      continue
    }

    if (level.at(pos.x, pos.y).isWall()) {
      level.setTile(pos.x, pos.y, newSpace())
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
