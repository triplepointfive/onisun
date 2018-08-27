import {
  generateCreatureWithAI,
  generateLevelMap,
  generateGame,
} from '../helpers'
import { Waiter, Point } from '../../../src/engine'

let creature = generateCreatureWithAI(new Waiter())
const map = generateLevelMap(),
  game = generateGame()

beforeEach(() => {
  map.addCreature(new Point(1, 1), creature)
})

it('Does not move', () => {
  expect(creature.ai.act(creature, game)).toBeTruthy()
  expect(map.creaturePos(creature)).toEqual(new Point(1, 1))
})
