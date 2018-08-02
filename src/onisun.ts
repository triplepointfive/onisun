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
  AbilitiesPickingScreen,
  RightHandSlot,
} from './engine'
import { includes, sample } from 'lodash'

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
  [5, () => new Missile('Rock', new Modifier({}))],
])

const itemsPool = new Pool<null, Item>([
  [1, () => new BodyArmor('Кольчуга', new Modifier({ defense: 10 }))],
  [5, () => new BodyArmor('Латы', new Modifier({ defense: 5 }))],
  [10, () => new BodyArmor('Роба', new Modifier({ defense: 1 }))],
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

export class OnisunProfessionPicker extends ProfessionPicker {
  constructor(
    private pool: Profession[],
    private maxLevel: number,
    private maxTaken: number
  ) {
    super()
  }

  public available(player: Player): Profession[] {
    let professions: Profession[] = []

    if (this.canUpdate(player)) {
      professions.push(this.updatableProfession(player))
    } else if (this.canTakeNewProfession(player)) {
      professions.push(this.newFromPool(player))
    }

    if (this.canTakeNewProfession(player)) {
      professions.push(
        this.newFromPool(player, professions.map(profession => profession.id))
      )
    } else if (this.canUpdate(player)) {
      professions.push(
        this.updatableProfession(
          player,
          professions.map(profession => profession.id)
        )
      )
    }

    return professions
  }

  protected canUpdate(player: Player): boolean {
    return player.professions.some(
      profession => profession.level < this.maxLevel
    )
  }

  protected updatableProfession(
    player: Player,
    excludeProfessions: number[] = []
  ): Profession {
    return sample(
      player.professions.filter(
        profession =>
          player.professions.length < this.maxTaken &&
          !includes(excludeProfessions, profession.id)
      )
    )
  }

  protected canTakeNewProfession(player: Player): boolean {
    return player.professions.length < this.maxTaken
  }

  protected newFromPool(
    player: Player,
    excludeProfessions: number[] = []
  ): Profession {
    const excluding = excludeProfessions.concat(
      player.professions.map(profession => profession.id)
    )
    return sample(
      this.pool.filter(profession => !includes(excluding, profession.id))
    )
  }
}

export enum OnisunTalentId {
  AttackerTwoHandedWeapons,
  AttackerHeavyWeapons,
  AttackerLightWeapons,
  AttackerTwoWeapons,
  AttackerDoubleTwoHandedWeapons,
  AttackerStrongGrip,
}

export class OnisunTalent extends Talent {
  constructor(
    public readonly id: OnisunTalentId,
    name: string,
    depth: number,
    rank: number,
    maxRank: number,
    description: string = ''
  ) {
    super(name, depth, rank, maxRank, description)
  }
}

export class OnisunDefenderProfession extends Profession {
  public readonly depthCost: number = 3

  constructor(
    public readonly id: number,
    public readonly name: string,
    public level: number = 1
  ) {
    super(id, name, level)

    // TODO: Validate all Talent's ids are uniq

    this.talents.push(
      new OnisunTalent(
        OnisunTalentId.AttackerTwoHandedWeapons,
        'Двуручные оружия',
        0,
        0,
        3
      )
    )
    this.talents.push(
      new OnisunTalent(
        OnisunTalentId.AttackerLightWeapons,
        'Легкие оружия',
        0,
        0,
        3
      )
    )
    this.talents.push(
      new OnisunTalent(
        OnisunTalentId.AttackerHeavyWeapons,
        'Тяжелые оружия',
        0,
        0,
        3
      )
    )

    this.talents.push(
      new OnisunTalent(
        OnisunTalentId.AttackerTwoWeapons,
        'Два оружия',
        1,
        0,
        1,
        'Позволяет брать оружие в каждую руку'
      )
    )
    // this.talents.push(new OnisunTalent(OnisunTalentId.Defender, 'Быстрые удары', 1, 0, 3))
    // this.talents.push(new OnisunTalent(OnisunTalentId.Defender, 'Мощный удар', 1, 0, 4))
    // this.talents.push(new OnisunTalent(OnisunTalentId.Defender, 'Выбивание оружия', 1, 0, 5))

    this.talents.push(
      new OnisunTalent(
        OnisunTalentId.AttackerDoubleTwoHandedWeapons,
        'Два двуручных оружия',
        2,
        0,
        2
      )
    )
    // this.talents.push(new OnisunTalent(OnisunTalentId.Defender, '- серия', 2, 0, 2))
    this.talents.push(
      new OnisunTalent(
        OnisunTalentId.AttackerStrongGrip,
        'Крепкий хват',
        2,
        0,
        2,
        'Оружие не выбивается из рук'
      )
    )
  }
}

export class Onisun extends Game {
  constructor(generatorOptions: GeneratorOptions) {
    let pool: Profession[] = []
    ;[
      'ботаник',
      'библиотекарь',
      'архитектор',

      'ученый',
      'флорист',
      'художник',

      'судья',
      'солдат',
      'спасатель',

      'программист',
      'портной',
      'повар',
    ].forEach((name, i) => {
      pool.push(new Profession(i, name, 1))
    })

    super(new OnisunProfessionPicker(pool, 3, 6))

    this.player = this.initPlayer()

    this.player.professions.push(new OnisunDefenderProfession(1, 'Оружейник'))
    this.player.professions.push(new OnisunDefenderProfession(2, 'Воин'))
    this.player.professions.push(new OnisunDefenderProfession(3, 'Маг'))
    this.player.professions.push(new OnisunDefenderProfession(4, ' Повар'))
    this.player.professions.push(new OnisunDefenderProfession(5, 'Колдун'))

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

    // rat().addToMap(new Point(1, 3), this.currentMap)
    // rat().addToMap(new Point(1, 4), this.currentMap)

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
      new Level([1, 1, 1, 3, 10]),
      new Characteristics({
        attack: 1,
        defense: 4,
        dexterity: 3,
        health: 10,
        radius: 10,
        speed: 100,
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
    // player.putOn(MissileSlot, rock)

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

    map = drawn([
      'WWWWWWWWWWW',
      'WRRRRRRRRRW',
      'WRRRRRRRRRW',
      'WRRRRRRRRRW',
      'WRRRRRRRRRW',
      'WRRRRRRRRRW',
      'WWWWWWWWWWW',
    ])

    if (options.addDoors) {
      addDoors(map)
    }
    centralize(map)
    map.game = this

    addItems(0.05, map, weapons.merge(itemsPool))

    return map
  }
}
