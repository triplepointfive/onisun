import { OneHandWeapon, Modifier, Creature, Clan, MetaAI, Dispatcher } from '../src/onisun'

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
  return new Creature(0, 0, 0, 0, 0, 0, 0, Clan.FreeForAll, generateMetaAI())
}
