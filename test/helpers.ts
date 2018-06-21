import { OneHandWeapon, Modifier, Creature, Clan, MetaAI, Dispatcher, AI, LevelMap } from '../src/onisun'
import drawn from '../src/generator/drawn'
import { Game } from '../src/game'

export const generateString = function(length: number = 7): string {
  return Math.random().toString(36).substring(length)
}

export const generateOneHandedWeapon = function(
  modifier: Modifier = new Modifier({})
): OneHandWeapon {
  return new OneHandWeapon(generateString(), modifier)
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

export const generateCreatureWithAI = function(ai: AI): Creature {
  return new Creature(0, 0, 50, 5, 0, Clan.FreeForAll, wrapAI(ai))
}

class TestGame extends Game {}

export const generateLevel = function(): LevelMap {
  let map = drawn([
    'WWWWW',
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
