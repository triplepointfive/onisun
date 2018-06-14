export * from './ai'
export * from './creature'
export * from './inventory'
export * from './items'
export * from './logger'
export * from './map'
export * from './characteristics'

import { generate } from './generator/dungeon'
import { addDoors, addCreatures, addItems } from './generator/post'

import { Creature, Clan } from './creature'
import { Dispatcher } from './ai'
import { Weapon, Item } from './items'
import { LevelMap } from './map'
import { Pool } from './pool'
import { Point } from './utils'
import { BodyArmor } from './items/internal';

export type GeneratorOptions = {
  minSize: number
  maxSize: number
  roomsCount: number

  addDoors: boolean
}

const weapons = new Pool([
  [1, () => new Weapon('Katana', 10)],
  [1, () => new Weapon('Axe', 7)],
  [1, () => new Weapon('Dagger', 3)],
  [3, () => new Weapon('Hammer', 5)],
])

const itemsPool = new Pool<null, Item>([
  [1, () => new BodyArmor('Кольчуга', 10)],
  [1, () => new BodyArmor('Латы', 5)],
  [5, () => new BodyArmor('Роба', 1)],
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

    this.player = new Creature(
      x,
      y,
      1,
      4,
      20,
      5,
      101,
      Clan.Player,
      new Dispatcher()
    )
    this.player.addToMap(this.map)
    this.player.putOn(weapons.pick(new Point(0, 0)))

    addCreatures(0.05, this.map, creaturesPool)
    addItems(0.01, this.map, itemsPool)
  }
}
