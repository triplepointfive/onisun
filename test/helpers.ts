import { OneHandWeapon, Modifier } from '../src/onisun'

export const generateString = function(length: number = 7): string {
  return Math.random().toString(36).substring(length)
}

export const generateOneHandedWeapon = function(
  modifier: Modifier = new Modifier({})
): OneHandWeapon {
  return new OneHandWeapon(generateString(), modifier)
}
