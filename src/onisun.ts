export * from './ai'
export * from './creature'
export * from './inventory'
export * from './items'
export * from './tile'
export * from './logger'
export * from './map'
export * from './characteristics'
export * from './utils'
export * from './level'

export * from './generator/post'
export { default as drawn } from './generator/drawn'
export { default as dungeon } from './generator/dungeon'

import dungeon from './generator/dungeon'
import drawn from './generator/drawn'
import {
  addDoors,
  addCreatures,
  addItems,
  centralize,
  addOnTile,
  connectMaps,
} from './generator/post'

import { Creature, Clan, Player } from './creature'
import { Dispatcher } from './ai'
import { OneHandWeapon, Item } from './items'
import { LevelMap } from './map'
import { Tile, StairwayDown, StairwayUp } from './tile'
import { Pool } from './pool'
import { BodyArmor } from './items/internal'
import { Modifier, Characteristics } from './characteristics'
import { Game } from './game'
import { Point } from './utils'
import { Level } from './level'

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
  roomsCount: 10,
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

const creaturesPool = new Pool<null, Creature>([
  [
    1,
    () => {
      return new Creature(
        new Characteristics({
          attack: 1,
          defense: 1,
          dexterity: 1,
          health: 1,
          radius: 5,
          speed: 100,
        }),

        Clan.PlayerOnlyEnemy,
        new Dispatcher(),
        'Rat',
      )
    },
  ],
])

export class Onisun extends Game {
  public player: Creature

  constructor(generatorOptions: GeneratorOptions) {
    super()

    this.player = this.initPlayer()

    let map1 = this.generateMap(generatorOptions)
    let map2 = this.generateMap(generatorOptions)
    let map3 = this.generateMap(generatorOptions)
    let map4 = this.generateMap(generatorOptions)
    let map5 = this.generateMap(generatorOptions)

    connectMaps(map1, map2)
    connectMaps(map2, map3)
    connectMaps(map3, map4)
    connectMaps(map4, map5)
    connectMaps(map5, map1)

    this.currentMap = map1

    addOnTile(
      this.currentMap,
      tile => tile.isFloor() && tile.passibleThrough(),
      (x, y) => {
        this.player.addToMap(new Point(x, y), this.currentMap)
      }
    )
  }

  protected initPlayer(): Creature {
    const dagger = new OneHandWeapon('Dagger', new Modifier({ attack: 3 }))

    let player = new Player(
      new Level([3, 5, 7, 10]),
      new Characteristics({
        attack: 1,
        defense: 4,
        dexterity: 3,
        health: 10,
        radius: 5,
        speed: 100,
      }),
      new Dispatcher()
    )
    player.putOn(dagger)

    return player
  }

  protected generateMap(options: GeneratorOptions): LevelMap {
    let map = dungeon(
      20,
      40,
      options.minSize,
      options.maxSize,
      options.roomsCount
    )

    // let map = drawn([
    //   'WWWWWWWWWWW',
    //   'WRRRCRRRRRW',
    //   'WRRRWRRRRRW',
    //   'WRRRWWWWWCW',
    //   'WRRRCCCCCCW',
    //   'WWWWWWWWWWW',
    // ])

    if (options.addDoors) {
      addDoors(map)
    }
    centralize(map)
    map.game = this

    addCreatures(0.05, map, creaturesPool)
    addItems(0.01, map, weapons.merge(itemsPool))

    return map
  }
}
