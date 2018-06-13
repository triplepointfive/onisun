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
import { Weapon, Item } from './items'
import { LevelMap } from './map'

import { sample } from 'lodash'

export type GeneratorOptions = {
  minSize: number
  maxSize: number
  roomsCount: number

  addDoors: boolean
}

export class Game {
  public player: Creature
  public map: LevelMap
  public itemsPool: Item[]
  public weapons: Weapon[]

  constructor(generatorOptions: GeneratorOptions) {
    const radius = 5

    this.weapons = [
      new Weapon('Katana', 10),
      new Weapon('Axe', 7),
      new Weapon('Dagger', 3),
      new Weapon('Hammer', 5),
    ]

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

    this.player = new Creature(x, y, 1, 4, 20, radius, 101, Clan.PlayerOnlyEnemy, new Dispatcher())
    this.player.addToMap(this.map)
    this.player.putOn(sample(this.weapons))

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
    creature2.putOn(sample(this.weapons))

    const creature3 = new Creature(x - 1, y, 1, 4, 5, radius, 100, Clan.PlayerOnlyEnemy, new Dispatcher())
    creature3.addToMap(this.map)
    creature3.putOn(sample(this.weapons))

    const creature4 = new Creature(x, y - 1, 1, 4, 5, radius, 100, Clan.PlayerOnlyEnemy, new Dispatcher())
    creature4.addToMap(this.map)
    creature4.putOn(sample(this.weapons))
  }
}
