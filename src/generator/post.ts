import { LevelMap, Tile } from '../onisun'
import { Pool } from '../pool'
import { Creature } from '../creature'
import { Point, cycle } from '../utils'
import { Item } from '../items/internal'

import { random } from 'lodash'

export const addDoors = function(
  level: LevelMap,
  addDoor: () => boolean = () => true
): LevelMap {
  for (let j = 1; j < level.height - 1; j++) {
    for (let i = 1; i < level.width; i++) {
      const tile = level.at(i, j),
        up = level.at(i, j - 1),
        down = level.at(i, j + 1),
        left = level.at(i - 1, j),
        right = level.at(i + 1, j)

      if (!addDoor() || tile.key !== 'C') {
        continue
      }

      if (
        left.key === 'D' ||
        right.key === 'D' ||
        up.key === 'D' ||
        down.key === 'D'
      ) {
        continue
      }

      if (
        left.key !== 'R' &&
        right.key !== 'R' &&
        up.key !== 'R' &&
        down.key !== 'R'
      ) {
        continue
      }

      if (
        (left.key === 'W' && right.key === 'W') ||
        (up.key === 'W' && down.key === 'W')
      ) {
        level.setTile(i, j, Tile.retrive('D'))
      }
    }
  }

  return level
}

export const addCreatures = function(
  chance: number,
  level: LevelMap,
  creaturesPool: Pool<null, Creature>
): LevelMap {
  for (let j = 1; j < level.height - 1; j++) {
    for (let i = 1; i < level.width - 1; i++) {
      if (level.at(i, j).passibleThrough() && Math.random() < chance) {
        creaturesPool.pick(null).addToMap(new Point(i, j), level)
      }
    }
  }

  return level
}

export const addItems = function(
  chance: number,
  level: LevelMap,
  itemsPool: Pool<null, Item>
): LevelMap {
  for (let j = 1; j < level.height - 1; j++) {
    for (let i = 1; i < level.width - 1; i++) {
      const tile = level.at(i, j)
      if (tile.passibleThrough() && Math.random() < chance) {
        tile.addItem(itemsPool.pick(null))
      }
    }
  }

  return level
}

export const centrize = function(level: LevelMap): LevelMap {
  let minX = level.width,
    minY = level.height,
    maxX = 0,
    maxY = 0

  for (let j = 1; j < level.height - 1; j++) {
    for (let i = 1; i < level.width - 1; i++) {
      if (!level.at(i, j).passibleThrough()) {
        continue
      }

      maxY = Math.max(j, maxY)
      maxX = Math.max(i, maxX)
      minY = Math.min(j, minY)
      minX = Math.min(i, minX)
    }
  }

  const dx = Math.floor((level.width - (maxX - minX)) / 2) - minX,
    dy = Math.floor((level.height - (maxY - minY)) / 2) - minY

  cycle(level.map, dy)
  level.map.forEach(row => cycle(row, dx))

  return level
}

export const addOnTile = function(level: LevelMap, match: (tile: Tile) => boolean, onValid: (x: number, y: number) => void): LevelMap {
  let iters = level.width * level.height

  while (iters > 0) {
    const x = random(0, level.width - 1),
          y = random(0, level.height - 1)

    if (match(level.at(x, y))) {
      onValid(x, y)
      return level
    }

    iters--
  }

  throw 'post add failed to add tile'
}

// export const connect = function(map1: LevelMap, map2: LevelMap)
