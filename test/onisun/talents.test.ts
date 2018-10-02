import {
  Player,
  DefenderSteelSkin,
  ProtectionType,
} from '../../src/onisun'
import { generatePlayer } from '../engine/helpers'

let player: Player

beforeEach(() => {
  player = generatePlayer()
})

it('DefenderSteelSkin', () => {
  let talent = new DefenderSteelSkin('steelSkin', 0, 0, 5)

  const oldProtections = player.protections

  expect(oldProtections.length).toEqual(1)
  expect(oldProtections[0].type).toEqual(ProtectionType.Unarmored)

  talent.upgrade(player)

  expect(player.protections.length).toEqual(1)
  expect(player.protections[0].type).toEqual(ProtectionType.Unarmored)
  expect(player.protections[0].value).toEqual(oldProtections[0].value + 1)

  talent.upgrade(player)
  expect(player.protections.length).toEqual(1)
  expect(player.protections[0].type).toEqual(ProtectionType.Unarmored)
  expect(player.protections[0].value).toEqual(oldProtections[0].value + 2)
})
