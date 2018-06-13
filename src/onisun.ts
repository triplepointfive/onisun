export * from './ai'
export * from './creature'
export * from './inventory'
export * from './items'
export * from './logger'
export * from './map'
export * from './characteristics'

import { generate } from './generator/dungeon'
import { addDoors } from './generator/post'

import { Creature, Clan } from './creature'
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

    this.player = new Creature(x, y, 1, 4, 20, radius, 101, Clan.Player, new Dispatcher())
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

    const creature2 = new Creature(x, y, 1, 4, 5, radius, 100, Clan.PlayerOnlyEnemy, new Dispatcher())
    creature2.addToMap(this.map)
    creature2.putOn(new Katana())

    const creature3 = new Creature(x - 1, y, 1, 4, 5, radius, 100, Clan.PlayerOnlyEnemy, new Dispatcher())
    creature3.addToMap(this.map)
    creature3.putOn(new Katana())

    const creature4 = new Creature(x, y - 1, 1, 4, 5, radius, 100, Clan.PlayerOnlyEnemy, new Dispatcher())
    creature4.addToMap(this.map)
    creature4.putOn(new Katana())
  }
}
