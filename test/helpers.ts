import { OneHandWeapon, Modifier, Creature, Clan, MetaAI, Dispatcher, AI, LevelMap } from '../src/onisun'
import drawn from '../src/generator/drawn'

export const generateString = function(length: number = 7): string {
  return Math.random().toString(36).substring(length)
}

export const generateOneHandedWeapon = function(
  modifier: Modifier = new Modifier({})
): OneHandWeapon {
  return new OneHandWeapon(generateString(), modifier)
}

export const generateMetaAI = function(): MetaAI {
  return new Dispatcher()
}

export const generateCreature = function(): Creature {
  return generateCreatureWithAI(generateMetaAI())
}

class AIWrapper extends MetaAI {
  public available(actor: Creature): boolean {
    return this.callAI.available(actor)
  }

  public act(actor: Creature, firstTurn: boolean): void {
    return this.callAI.act(actor, firstTurn)
  }

  constructor(public callAI: AI) { super() }
}

const wrapAI = function(ai: AI): MetaAI {
  return new AIWrapper(ai)
}

export const generateCreatureWithAI = function(ai: AI): Creature {
  return new Creature(1, 1, 0, 0, 50, 0, 0, Clan.FreeForAll, wrapAI(ai))
}

export const generateLevel = function(): LevelMap {
  return drawn([
    'WWWWW',
    'WRRRW',
    'WRRRW',
    'WRRRW',
    'WWWWW',
  ])
}
