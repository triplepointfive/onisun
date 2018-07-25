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
} from '../src/engine'
import drawn from '../src/generator/drawn'
import { Game } from '../src/game'
import { times, random } from 'lodash'

export const generateString = function(length: number = 7): string {
  return Math.random()
    .toString(36)
    .substring(length)
}

export const generateOneHandedWeapon = function(
  modifier: Modifier = new Modifier({})
): OneHandWeapon {
  return new OneHandWeapon(generateString(), modifier)
}

export const generateBodyArmor = function(): BodyArmor {
  return new BodyArmor(generateString(), new Modifier({}))
}

export const generateMissile = function(): Missile {
  return new Missile('test missile', new Modifier({}))
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
  return new Creature(generateCharacteristics(), wrapAI(ai), fakeSpecie)
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
    generateMetaAI(),
    fakeSpecie
  )
}

class TestGame extends Game {}

export const generateLevelMap = function(): LevelMap {
  let map = drawn([
    'WWWWW',
    'WRRRW',
    'WRRRW',
    'WRRRW',
    'WRRRW',
    'WRRRW',
    'WRRRW',
    'WRRRW',
    'WWWWW',
  ])

  map.game = generateGame()

  return map
}

export const generateGame = function(): Game {
  return new TestGame()
}

export const tileToChar = function(tile: Tile): string {
  if (tile.isWall()) {
    return 'W'
  } else if (tile.isDoor()) {
    return 'D'
  } else if (tile.isFloor) {
    return ' '
  } else {
    return '?'
  }
}

export const prettyMap = function(map: LevelMap): string[] {
  let stringMap = new Array(map.map[0].length).fill('')

  map.map.forEach(column => {
    column.forEach((tile, i) => {
      stringMap[i] += tileToChar(tile)
    })
  })

  return stringMap
}

let professionId = 0
export const generateProfession = function(level: number = 1): Profession {
  const name = times(4, () => random(35).toString(36)).join('')
  return new Profession(professionId++, name, level)
}
