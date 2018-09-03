import { random, times } from 'lodash'
import {
  AI,
  allAbilities,
  BodyArmor,
  Characteristics,
  Clan,
  Corridor,
  Creature,
  Dispatcher,
  Door,
  drawn,
  Game,
  Level,
  LevelMap,
  MetaAI,
  Missile,
  Modifier,
  OneHandWeapon,
  Player,
  PlayerAI,
  Profession,
  Room,
  Specie,
  Tile,
  TileTypes,
  TileVisitor,
  Wall,
  CreatureEvent,
  LevelMapId,
  DamageType,
  AICreature,
  Talent,
  ProtectionType,
} from '../../src/engine'

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

export const generateOneHandedWeapon = function(): OneHandWeapon {
  return new OneHandWeapon(generateString(), 1, [
    { type: DamageType.Melee, dice: { max: 10, times: 3 }, extra: 4 },
  ])
}

export const generateBodyArmor = function(): BodyArmor {
  return new BodyArmor(generateString(), 1, [
    { type: ProtectionType.Medium, value: 3 },
  ])
}

export const generateMissile = function(): Missile {
  return new TestMissile('test missile', 1, new Modifier({}))
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
  public act(
    actor: Creature,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    return this.aiToRun.act(actor, levelMap, game)
  }
}

const wrapAI = function(ai: AI): MetaAI {
  return new AIWrapper(ai)
}

const fakeSpecie = {
  name: 'Test specie',
  weight: 10,
  clan: Clan.FreeForAll,
  abilities: allAbilities,
  protections: [],
  damages: [],
}

export class TestCreature extends AICreature {}
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

let levelMapId = 0
export const generateLevelMap = function(
  id: LevelMapId = levelMapId++
): LevelMap {
  let map = new LevelMap(
    id,
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

export const generateGame = function(
  { player, professionPicker } = {
    player: undefined,
    professionPicker: undefined,
  }
): Game {
  return new TestGame(player, professionPicker)
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

class TestTalent extends Talent {
  public onObtain(game: Game): void {}
}

let talentId = 0
export const generateTalent = function({ depth } = { depth: 0 }): Talent {
  return new TestTalent(
    talentId++,
    generateString(),
    depth,
    0,
    3,
    generateString()
  )
}
