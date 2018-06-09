export * from './ai'
export * from './creature'
export * from './inventory'
export * from './items'
export * from './logger'
export * from './map'
export * from './characteristics'

import { generate } from './generator/dungeon'
import { addDoors } from './generator/post'

import { Creature } from './creature'
import { Dispatcher } from './ai'
import { Katana } from './items'
import { LevelMap } from './map'

export type GeneratorOptions = {
  minSize: number,
  maxSize: number,
  roomsCount: number,

  addDoors: boolean,
}

export const generateMap = function(
  generatorOptions: GeneratorOptions,
  radius: number,
): LevelMap {
  let map = generate(
    50,
    50,
    generatorOptions.minSize,
    generatorOptions.maxSize,
    generatorOptions.roomsCount,
  )

  if (generatorOptions.addDoors) {
    map = addDoors(map)
  }

  let x = 1,
      y = 1

  while (!map.visibleThrough(x, y)) {
    if (x < map.width - 1) {
      x += 1
    } else {
      x = 1
      y += 1
    }
  }

  const creature1 = new Creature(
    x,
    y,
    50,
    radius,
    10,
    new Dispatcher(),
  )

  creature1.addToMap(map)
  creature1.putOn(new Katana())

  x = map.width - 1
  y = map.height -1

  while (!map.visibleThrough(x, y)) {
    if (x > 1) {
      x -= 1
    } else {
      x = map.width - 1
      y -= 1
    }
  }

  const creature2 = new Creature(
    x,
    y,
    100,
    radius,
    5,
    new Dispatcher(),
  )

  creature2.addToMap(map)
  creature2.putOn(new Katana())

  return map
}