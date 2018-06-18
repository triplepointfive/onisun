export * from './ai'
export * from './creature'
export * from './inventory'
export * from './items'
export * from './logger'
export * from './map'
export * from './characteristics'

import { generate } from './generator/dungeon'
import drawn from './generator/drawn'
import { addDoors, addCreatures, addItems, centrize } from './generator/post'

import { Creature, Clan } from './creature'
import { Dispatcher } from './ai'
import { OneHandWeapon, Item } from './items'
import { LevelMap } from './map'
import { Pool } from './pool'
import { Point } from './utils'
import { BodyArmor } from './items/internal'
import { Modifier } from './characteristics'

export type GeneratorOptions = {
  minSize: number
  maxSize: number
  roomsCount: number

  addDoors: boolean
}

export let baseConfig = {
  addDoors: false,
  minSize: 3,
  maxSize: 10,
  roomsCount: 20,
}

const weapons = new Pool<null, Item>([
  [1, () => new OneHandWeapon('Katana', new Modifier({ attack: 10 }))],
  [3, () => new OneHandWeapon('Axe', new Modifier({ attack: 7 }))],
  [7, () => new OneHandWeapon('Dagger', new Modifier({ attack: 3 }))],
  [5, () => new OneHandWeapon('Hammer', new Modifier({ attack: 5 }))],
])

const itemsPool = new Pool<null, Item>([
  [1, () => new BodyArmor('Кольчуга', new Modifier({ defense: 10 }))],
  [5, () => new BodyArmor('Латы', new Modifier({ defense: 5 }))],
  [10, () => new BodyArmor('Роба', new Modifier({ defense: 1 }))],
])

const creaturesPool = new Pool<Point, Creature>([
  [
    1,
    ({ x, y }) =>
      new Creature(
        x,
        y,
        1,
        4,
        5,
        5,
        100,
        Clan.PlayerOnlyEnemy,
        new Dispatcher()
      ),
  ],
])

export class Game {
  public player: Creature
  public map: LevelMap

  constructor(generatorOptions: GeneratorOptions) {
    // this.map = generate(
    //   50,
    //   50,
    //   generatorOptions.minSize,
    //   generatorOptions.maxSize,
    //   generatorOptions.roomsCount
    // )

    this.map = drawn([
      'WWWWWWWWWWW',
      'WRRRCRRRRRW',
      'WRRRWRRRRRW',
      'WRRRWWWWWCW',
      'WRRRCCCCCCW',
      'WWWWWWWWWWW',
    ])

    if (generatorOptions.addDoors) {
      this.map = addDoors(this.map)
    }
    centrize(this.map)

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

    const dagger = new OneHandWeapon('Dagger', new Modifier({ attack: 3 }))

    this.player = new Creature(
      x,
      y,
      1,
      4,
      20,
      5,
      100,
      Clan.Player,
      new Dispatcher()
    )
    this.player.addToMap(this.map)
    this.player.putOn(dagger)

    // addCreatures(0.5, this.map, creaturesPool)
    addItems(0.5, this.map, weapons.merge(itemsPool))
  }
}
