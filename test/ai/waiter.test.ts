import { generateCreatureWithAI, generateLevelMap } from '../helpers'
import { Waiter, Point } from '../../src/engine'

let creature = generateCreatureWithAI(new Waiter())
const map = generateLevelMap()

beforeEach(() => {
  creature.addToMap(new Point(1, 1), map)
  creature.act(map)
})

it('Does not move', () => {
  const oldPos = creature.pos
  expect(creature.pos).toEqual(oldPos)
})

it('Always available', () => {
  expect(creature.ai.available(creature)).toBeTruthy()
})
