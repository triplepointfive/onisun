import { LevelMap, Tile, Item } from '../../engine'
import { Pool } from '../lib/pool'
import { Creature } from '../models/creature'
import { Point, cycle } from '../utils/utils'

import { random } from 'lodash'

export const addDoors = function(
  level: LevelMap,
  doorTile: () => Tile,
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
        level.setTile(i, j, doorTile())
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
  for (let i = 1; i < level.width - 1; i++) {
    for (let j = 1; j < level.height - 1; j++) {
      if (level.at(i, j).passibleThrough() && Math.random() < chance) {
        level.addCreature(new Point(i, j), creaturesPool.pick(null))
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
        tile.addItem(itemsPool.pick(null), 1)
      }
    }
  }

  return level
}

export const centralize = function(level: LevelMap): LevelMap {
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

  cycle(level.map, dx)
  level.map.forEach(row => cycle(row, dy))

  return level
}

// TODO: Move away from generators
// TODO: Do not throw
export const withMatchingTile = function(
  level: LevelMap,
  match: (tile: Tile) => boolean,
  onValid: (x: number, y: number) => void
): LevelMap {
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

export const safeWithMatchingTile = function(
  level: LevelMap,
  match: (tile: Tile) => boolean
): { tile: Tile; x: number; y: number } | undefined {
  let iters = level.width * level.height

  while (iters > 0) {
    const x = random(0, level.width - 1),
      y = random(0, level.height - 1),
      tile = level.at(x, y)

    if (match(tile)) {
      return { tile, x, y }
    }

    iters--
  }
}

export const withEachTile = function(
  level: LevelMap,
  match: (tile: Tile) => boolean,
  onValid: (tile: Tile, x: number, y: number) => void
): void {
  level.each((tile, x, y) => {
    if (match(tile)) {
      onValid(tile, x, y)
    }
  })
}
