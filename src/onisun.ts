export * from './ai'
export * from './creature'
export * from './inventory'
export * from './items'
export * from './tile'
export * from './logger'
export * from './map'
export * from './characteristics'
export * from './utils'

import { generate } from './generator/dungeon'
import drawn from './generator/drawn'
import { addDoors, addCreatures, addItems, centrize, addOnTile } from './generator/post'

import { Creature, Clan } from './creature'
import { Dispatcher } from './ai'
import { OneHandWeapon, Item } from './items'
import { LevelMap } from './map'
import { Tile, StairwayDown } from './tile'
import { Pool } from './pool'
import { BodyArmor } from './items/internal'
import { Modifier } from './characteristics'
import { Game } from './game';
import { Point } from './utils';

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
  roomsCount: 5,
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
    () =>
      new Creature(
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

export class Onisun extends Game {
  public player: Creature
  public map: LevelMap

  constructor(generatorOptions: GeneratorOptions) {
    super()
    this.player = this.initPlayer()

    this.map = this.generateMap(generatorOptions)
    let map2 = this.generateMap(generatorOptions)

    addOnTile(
      this.map,
      tile => tile.isFloor(),
      (x, y) => {
        const tile = new StairwayDown(this.map, map2, new Point(1, 1))
        tile.onAction = () => {
          this.map = map2
        }
        this.map.setTile(x, y, tile)
      }
    )

    addOnTile(
      this.map,
      tile => tile.isFloor(),
      (x, y) => {
        // this.map.setTile(x, y, Tile.retrive('>'))
        this.player.addToMap(new Point(x, y), this.map)
      }
    )
  }

  protected initPlayer(): Creature {
    const dagger = new OneHandWeapon('Dagger', new Modifier({ attack: 3 }))

    let player = new Creature(
      1,
      4,
      2,
      5,
      100,
      Clan.Player,
      new Dispatcher()
    )
    player.putOn(dagger)

    return player
  }

  protected generateMap(options: GeneratorOptions): LevelMap {
    // let map = generate(
    //   50,
    //   50,
    //   options.minSize,
    //   options.maxSize,
    //   options.roomsCount
    // )

    let map = drawn([
      'WWWWWWWWWWW',
      'WRRRCRRRRRW',
      'WRRRWRRRRRW',
      'WRRRWWWWWCW',
      'WRRRCCCCCCW',
      'WWWWWWWWWWW',
    ])

    if (options.addDoors) {
      addDoors(map)
    }
    centrize(map)
    map.game = this

    // addCreatures(0.1, this.map, creaturesPool)
    // addItems(0.5, map, weapons.merge(itemsPool))

    return map
  }
}
