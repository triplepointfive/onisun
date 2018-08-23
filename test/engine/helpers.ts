import {
  OneHandWeapon,
  Modifier,
  Creature,
  Clan,
  MetaAI,
  Dispatcher,
  AI,
  LevelMap,
  Tile,
  Characteristics,
  Specie,
  allAbilities,
  BodyArmor,
  Missile,
  Profession,
  Player,
  Level,
  drawn,
  Game,
  TileTypes,
  Corridor,
  Wall,
  Floor,
  Door,
  Room,
  TileVisitor,
  Dungeon,
  PlayerAI,
} from '../../src/engine'

import { times, random } from 'lodash'

export const generateString = function(length: number = 7): string {
  return Math.random()
    .toString(36)
    .substring(length)
}

export const testTiles: Map<string, () => Tile> = new Map()
testTiles.set('C', () => new Corridor('C', TileTypes.Floor))
testTiles.set('W', () => new Wall())
testTiles.set('R', () => new Room())
testTiles.set('D', () => new Door())

class TestMissile extends Missile {}

export const generateOneHandedWeapon = function(
  modifier: Modifier = new Modifier({})
): OneHandWeapon {
  return new OneHandWeapon(generateString(), modifier)
}

export const generateBodyArmor = function(): BodyArmor {
  return new BodyArmor(generateString(), new Modifier({}))
}

export const generateMissile = function(): Missile {
  return new TestMissile('test missile', new Modifier({}))
}

export const generatePlayerAI = function(): PlayerAI {
  return new PlayerAI()
}

export const generateItem = function() {
  return generateOneHandedWeapon()
}

export const generateMetaAI = function(): MetaAI {
  return new Dispatcher()
}

export const generateCreature = function(): Creature {
  return generateCreatureWithAI(generateMetaAI())
}

class AIWrapper extends MetaAI {
  constructor(aiToRun: AI = null) {
    super(aiToRun)
    aiToRun.prevAI = this
  }

  public available(actor: Creature): boolean {
    return this.aiToRun.available(actor)
  }

  public act(actor: Creature, firstTurn: boolean): void {
    if (this.available(actor)) {
      return this.aiToRun.act(actor, firstTurn)
    } else {
      throw 'aiToRun is not available!'
    }
  }
}

const wrapAI = function(ai: AI): MetaAI {
  return new AIWrapper(ai)
}

const fakeSpecie = new Specie('Test specie', Clan.FreeForAll, allAbilities)

export const generateCreatureWithAI = function(ai: AI): Creature {
  return new TestCreature(generateCharacteristics(), wrapAI(ai), fakeSpecie)
}

export const generateCharacteristics = function(): Characteristics {
  return new Characteristics({
    attack: 0,
    defense: 0,
    dexterity: 0,
    health: 50,
    radius: 5,
    speed: 0,
  })
}

export const generateLevel = function(): Level {
  return new Level([1])
}

export const generatePlayer = function(): Player {
  return new Player(
    generateLevel(),
    generateCharacteristics(),
    generatePlayerAI(),
    fakeSpecie
  )
}

export class TestGame extends Game {}

export const generateLevelMap = function(): LevelMap {
  let map = new LevelMap(
    0,
    drawn(
      [
        'WWWWW',
        'WRRRW',
        'WRRRW',
        'WRRRW',
        'WRRRW',
        'WRRRW',
        'WRRRW',
        'WRRRW',
        'WWWWW',
      ],
      testTiles
    )
  )

  return map
}

export const generateGame = function(): Game {
  return new TestGame()
}

class TileCharVisitor extends TileVisitor {
  public char: string
  public onWall(): void {
    this.char = 'W'
  }
  public onDoor(): void {
    this.char = 'D'
  }
  public onFloor(): void {
    this.char = ' '
  }
  protected default(): void {
    this.char = '?'
  }
}

export const prettyMap = function(map: LevelMap): string[] {
  let stringMap = new Array(map.map[0].length).fill(''),
    visitor = new TileCharVisitor()

  map.map.forEach(column => {
    column.forEach((tile, i) => {
      tile.visit(visitor)
      stringMap[i] += visitor.char
    })
  })

  return stringMap
}

let professionId = 0
export const generateProfession = function(level: number = 1): Profession {
  const name = times(4, () => random(35).toString(36)).join('')
  return new Profession(professionId++, name, level)
}

export class TestCreature extends Creature {}
