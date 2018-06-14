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

import { random } from 'lodash'

export type GeneratorOptions = {
  minSize: number
  maxSize: number
  roomsCount: number

  addDoors: boolean
}

class Pool<T> {
  private totalWeight: number = 0
  private items: [number, T][] = []

  constructor(items: [number, T][]) {
    items.forEach(([weight, item]) => this.add(weight, item))
  }

  public add(weight: number, item: T): void {
    if (weight < 1) {
      throw `Item '${item}' weight is lower than 1`
    }

    this.items.push([weight, item])
    this.totalWeight += Math.ceil(weight)
  }

  public pick(): T {
    if (this.items.length === 0) {
      throw 'Tried to use empty pool'
    }

    let pick = random(this.totalWeight - 1)

    return this.items.find(([weight, item]) => {
      pick -= weight

      return pick <= 0
    })[1]
  }
}

export class Game {
  public player: Creature
  public map: LevelMap
  public itemsPool: Item[]

  constructor(generatorOptions: GeneratorOptions) {
    const radius = 5

    const weapons = new Pool([
      [1, new Weapon('Katana', 10)],
      [1, new Weapon('Axe', 7)],
      [1, new Weapon('Dagger', 3)],
      [3, new Weapon('Hammer', 5)],
    ])

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
    this.player.putOn(weapons.pick())

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
    creature2.putOn(weapons.pick())

    const creature3 = new Creature(x - 1, y, 1, 4, 5, radius, 100, Clan.PlayerOnlyEnemy, new Dispatcher())
    creature3.addToMap(this.map)
    creature3.putOn(weapons.pick())

    const creature4 = new Creature(x, y - 1, 1, 4, 5, radius, 100, Clan.PlayerOnlyEnemy, new Dispatcher())
    creature4.addToMap(this.map)
    creature4.putOn(weapons.pick())
  }
}
