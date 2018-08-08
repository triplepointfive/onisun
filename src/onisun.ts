import {
  dungeon,
  drawn,
  addDoors,
  addCreatures,
  addItems,
  centralize,
  addOnTile,
  connectMaps,
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
} from './engine'
import { TalentStatus } from './engine/profession'
import { TalentsTreeScreen } from './engine/screens/talents_tree_screen'

import { OnisunProfessionPicker } from './onisun/professions'
import { ProfessionPickingScreen } from './engine/screens/profession_picking_screen'
import { HealPotion } from './onisun/potions'
import { MissileScreen } from './engine/screens/missile_screen';
export * from './onisun/professions'
export * from './onisun/talents'

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
  roomsCount: 10,
  simple: true,
}

const weapons = new Pool<null, Item>([
  [1, () => new OneHandWeapon('Katana', new Modifier({ attack: 10 }))],
  [3, () => new OneHandWeapon('Axe', new Modifier({ attack: 7 }))],
  [7, () => new OneHandWeapon('Dagger', new Modifier({ attack: 3 }))],
  [5, () => new OneHandWeapon('Hammer', new Modifier({ attack: 5 }))],
  [5, () => new Missile('Rock', new Modifier({}))],
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

export class Onisun extends Game {
  public professionPicker: OnisunProfessionPicker

  constructor(generatorOptions: GeneratorOptions) {
    super()
    this.player = this.initPlayer()
    this.professionPicker = new OnisunProfessionPicker(this.player)
    this.player.professions.push(this.professionPicker.attacker)

    let map1 = this.generateMap(generatorOptions)
    let map2 = this.generateMap(generatorOptions)
    // let map3 = this.generateMap(generatorOptions)
    // let map4 = this.generateMap(generatorOptions)
    // let map5 = this.generateMap(generatorOptions)

    // addCreatures(0.05, map1, creaturesPool1)
    // addCreatures(0.06, map2, creaturesPool2)
    // addCreatures(0.07, map3, creaturesPool3)
    // addCreatures(0.08, map4, creaturesPool4)
    // addCreatures(0.09, map5, creaturesPool5)

    connectMaps(map1, map2)
    // connectMaps(map2, map3)
    // connectMaps(map3, map4)
    // connectMaps(map4, map5)

    this.currentMap = map1

    rat().addToMap(new Point(4, 1), this.currentMap)
    rat().addToMap(new Point(2, 5), this.currentMap)
    rat().addToMap(new Point(6, 3), this.currentMap)
    rat().addToMap(new Point(4, 3), this.currentMap)
    rat().addToMap(new Point(8, 3), this.currentMap)

    addOnTile(
      this.currentMap,
      tile => tile.isFloor() && tile.passibleThrough(),
      (x, y) => {
        this.player.addToMap(new Point(1, 3), this.currentMap)
      }
    )

    this.screen = new MissileScreen(this)
  }

  protected initPlayer(): Player {
    const playerSpecie = new Specie('Player', Clan.Player, allAbilities)

    let player = new Player(
      new Level([1, 1, 1, 3, 10]),
      new Characteristics({
        attack: 1,
        defense: 4,
        dexterity: 3,
        health: 10,
        radius: 10,
        speed: 80,
      }),
      new PlayerAI(),
      // new Dispatcher(),
      playerSpecie
    )

    const dagger = new OneHandWeapon('Dagger', new Modifier({ attack: 3 }))
    const katana = new OneHandWeapon('Katana', new Modifier({ attack: 10 }))
    const rock = new Missile('Rock', new Modifier({}))
    player.inventory.putToBag(dagger, 2)
    player.inventory.putToBag(katana, 1)
    player.inventory.putToBag(rock, 30)
    // player.putOn(RightHandSlot, dagger)
    player.inventory.equip(player, MissileSlot, rock)

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

    if (options.simple) {
      map = drawn([
        'WWWWWWWWWWWWWWWWWWWWWW',
        'WRRRRRRRRRRRRRRRRRRRRW',
        'WRRRRRRRRRRRRRRRRRRRRW',
        'WRRRRRRRRRRRRRRRRRRRRW',
        'WRRRRRRRRRRRRRRRRRRRRW',
        'WRRRRRRRRRRRRRRRRRRRRW',
        'WWWWWWWWWWWWWWWWWWWWWW',
      ])
    }

    if (options.addDoors) {
      addDoors(map)
    }
    centralize(map)
    map.game = this

    addItems(0.05, map, weapons.merge(itemsPool))

    return map
  }
}
