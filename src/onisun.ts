import {
  dungeon,
  drawn,
  addDoors,
  addCreatures,
  addItems,
  centralize,
  addOnTile,
  Creature,
  Clan,
  Player,
  Specie,
  allAbilities,
  Dispatcher,
  OneHandWeapon,
  Item,
  LevelMap,
  Pool,
  BodyArmor,
  Modifier,
  Characteristics,
  Game,
  Point,
  Level,
  Ability,
  Missile,
  ProfessionPicker,
  Profession,
  GroupedItem,
  MissileSlot,
  PlayerAI,
  Talent,
  MissileWeaponSlot,
  StairwayDown,
  StairwayUp,
} from './engine'
import { TalentStatus } from './engine/profession'
import { TalentsTreeScreen } from './engine/screens/talents_tree_screen'

import { OnisunProfessionPicker } from './onisun/professions'
import { ProfessionPickingScreen } from './engine/screens/profession_picking_screen'
import { HealPotion } from './onisun/potions'
import { woodenArrow, ironArrow, commonBow, smallRock } from './onisun/items'
import { Inventory } from './engine/inventory'
import { InventoryScreen } from './engine/screens/inventory_screen'
import { identifier } from '../node_modules/@types/babel-types';

export * from './onisun/professions'
export * from './onisun/talents'
export * from './onisun/items'

export type GeneratorOptions = {
  minSize: number
  maxSize: number
  roomsCount: number

  addDoors: boolean
  simple: boolean
}

export let baseConfig = {
  addDoors: false,
  minSize: 3,
  maxSize: 10,
  roomsCount: 3,
  simple: true,
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
  [100, () => new HealPotion()],
])

const newCreature = (characteristics: Characteristics, name: string) => {
  return new Creature(
    characteristics,
    new Dispatcher(),
    new Specie(name, Clan.PlayerOnlyEnemy, [])
  )
}

const floatingEye = () => {
  return newCreature(
    new Characteristics({
      attack: 1,
      defense: 1,
      dexterity: 1,
      health: 100,
      radius: 5,
      speed: 200,
    }),
    'Floating eye'
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
      speed: 90,
    }),
    'Rat'
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
    'Orc'
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
      speed: 120,
    }),
    'Undead'
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
      speed: 90,
    }),
    'Robot'
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
    'Dragon'
  )
}

const creaturesPool1 = new Pool<null, Creature>([[1, rat]])
const creaturesPool2 = new Pool<null, Creature>([[1, rat], [2, orc]])
const creaturesPool3 = new Pool<null, Creature>([
  [1, rat],
  [1, orc],
  [2, undead],
])
const creaturesPool4 = new Pool<null, Creature>([[2, undead], [2, robot]])
const creaturesPool5 = new Pool<null, Creature>([[2, robot], [1, dragon]])

const generateMap = (id: number, game: Game, options: GeneratorOptions) => {
  let map = new LevelMap(id, dungeon(
    40,
    30,
    options.minSize,
    options.maxSize,
    options.roomsCount
  ))

  if (options.simple) {
    map = new LevelMap(id, drawn([
      'WWWWWWWWWWWWWWWWWWWWWW',
      'WRRRRRRRRRRRRRRRRRRRRW',
      'WRRRRRRRRRRRRRRRRRRRRW',
      'WRRRRRRRRRRRRRRRRRRRRW',
      'WRRRRRRRRRRRRRRRRRRRRW',
      'WRRRRRRRRRRRRRRRRRRRRW',
      'WWWWWWWWWWWWWWWWWWWWWW',
    ]))
  }

  if (options.addDoors) {
    addDoors(map)
  }
  centralize(map)
  map.game = game

  addItems(0.05, map, weapons.merge(itemsPool))

  return map
}

export class Onisun extends Game {
  public professionPicker: OnisunProfessionPicker

  constructor(generatorOptions: GeneratorOptions) {
    super()
    this.player = this.initPlayer()
    this.professionPicker = new OnisunProfessionPicker(this.player)
    this.player.professions.push(this.professionPicker.attacker)

    console.time('generateMap')

    this.addMap(-1, (id, game) => {
      let map = generateMap(id, game, generatorOptions)

      addOnTile(
        map,
        tile => tile.isFloor() && tile.passibleThrough(),
        (x, y) => {
          const downTile = new StairwayDown(map, 0)
          map.setTile(x, y, downTile)
        }
      )

      return map
    })

    for (let i = 0; i < 50; i ++) {
      this.addMap(i, (id, game) => {
        let map = generateMap(id, game, generatorOptions)

        addOnTile(
          map,
          tile => tile.isFloor() && tile.passibleThrough(),
          (x, y) => {
            map.setTile(x, y, new StairwayUp(map, i - 1))
          }
        )

        addOnTile(
          map,
          tile => tile.isFloor() && tile.passibleThrough(),
          (x, y) => {
            map.setTile(x, y, new StairwayDown(map, i + 1))
          }
        )

        addCreatures(i * 0.05, map, creaturesPool1)

        return map
      })
    }

    console.timeEnd('generateMap')

    this.currentMap = this.getMap(-1)

    addOnTile(
      this.currentMap,
      tile => tile.isFloor() && tile.passibleThrough(),
      (x, y) => {
        this.player.addToMap(new Point(x, y), this.currentMap)
      }
    )
  }

  protected initPlayer(): Player {
    const playerSpecie = new Specie('Player', Clan.Player, allAbilities)

    let player = new Player(
      new Level([1, 3, 5, 10, 20]),
      new Characteristics({
        attack: 1,
        defense: 4,
        dexterity: 3,
        health: 100,
        radius: 10,
        speed: 80,
      }),
      new PlayerAI(),
      playerSpecie
    )

    const dagger = new OneHandWeapon('Dagger', new Modifier({ attack: 3 }))
    const katana = new OneHandWeapon('Katana', new Modifier({ attack: 10 }))

    const wooden = woodenArrow()
    const iron = ironArrow()
    const rock = smallRock()

    const bow = commonBow()

    player.inventory.putToBag(dagger, 2)
    player.inventory.putToBag(katana, 1)

    player.inventory.putToBag(wooden, 5)
    player.inventory.putToBag(iron, 5)
    player.inventory.putToBag(rock, 5)

    player.inventory.putToBag(bow, 2)

    // player.putOn(RightHandSlot, dagger)
    // player.inventory.missileWeaponSlot.equip(player, bow)
    player.inventory.missileSlot.equip(player, wooden)

    return player
  }
}
