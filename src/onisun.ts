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
  minSize: number
  maxSize: number
  roomsCount: number

  addDoors: boolean
}

export class Game {
  public player: Creature
  public map: LevelMap

  constructor(generatorOptions: GeneratorOptions) {
    const radius = 5

    this.map = generate(
      50,
      50,
      generatorOptions.minSize,
      generatorOptions.maxSize,
      generatorOptions.roomsCount
    )

    if (generatorOptions.addDoors) {
      this.map = addDoors(this.map)
    }

    let x = 1,
      y = 1

    while (!this.map.visibleThrough(x, y)) {
      if (x < this.map.width - 1) {
        x += 1
      } else {
        x = 1
        y += 1
      }
    }

    this.player = new Creature(x, y, 1, 4, 50, radius, 5, new Dispatcher())
    this.player.addToMap(this.map)
    this.player.putOn(new Katana())

    x = this.map.width - 1
    y = this.map.height - 1

    while (!this.map.visibleThrough(x, y)) {
      if (x > 1) {
        x -= 1
      } else {
        x = this.map.width - 1
        y -= 1
      }
    }

    const creature2 = new Creature(x, y, 1, 4, 100, radius, 10, new Dispatcher())

    creature2.addToMap(this.map)
    creature2.putOn(new Katana())
  }
}
