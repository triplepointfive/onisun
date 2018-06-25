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

const newCreature = (characteristics: Characteristics, name: string) => {
      return new Creature(
        characteristics,
        Clan.PlayerOnlyEnemy,
        new Dispatcher(),
        name
      )
}

const rat = () => {
  return newCreature(
        new Characteristics({
          attack: 1,
          defense: 1,
          dexterity: 1,
          health: 1,
          radius: 5,
          speed: 110,
        }),
        'Rat',
   )
}

const orc = () => {
  return newCreature(
        new Characteristics({
          attack: 3,
          defense: 3,
          dexterity: 2,
          health: 5,
          radius: 5,
          speed: 100,
        }),
        'Orc',
   )
}

const undead = () => {
  return newCreature(
        new Characteristics({
          attack: 2,
          defense: 7,
          dexterity: 1,
          health: 10,
          radius: 5,
          speed: 80,
        }),
        'Undead',
   )
}

const robot = () => {
  return newCreature(
        new Characteristics({
          attack: 5,
          defense: 5,
          dexterity: 3,
          health: 7,
          radius: 7,
          speed: 110,
        }),
        'Robot',
   )
}

const dragon = () => {
  return newCreature(
        new Characteristics({
          attack: 7,
          defense: 7,
          dexterity: 7,
          health: 30,
          radius: 5,
          speed: 100,
        }),
        'Dragon',
   )
}

const creaturesPool1 = new Pool<null, Creature>([ [ 1, rat, ], ])
const creaturesPool2 = new Pool<null, Creature>([ [ 1, rat, ], [2, orc ]])
const creaturesPool3 = new Pool<null, Creature>([ [ 1, rat, ], [ 1, orc], [2, undead] ])
const creaturesPool4 = new Pool<null, Creature>([ [ 2, undead ], [ 2, robot ] ])
const creaturesPool5 = new Pool<null, Creature>([ [ 2, robot, ], [1, dragon ] ])

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

    addCreatures(0.05, map1, creaturesPool1)
    addCreatures(0.06, map2, creaturesPool2)
    addCreatures(0.07, map3, creaturesPool3)
    addCreatures(0.08, map4, creaturesPool4)
    addCreatures(0.09, map5, creaturesPool5)

    connectMaps(map1, map2)
    connectMaps(map2, map3)
    connectMaps(map3, map4)
    connectMaps(map4, map5)

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

    addItems(0.01, map, weapons.merge(itemsPool))

    return map
  }
}
