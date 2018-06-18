import { generateCreatureWithAI, generateLevel } from '../helpers'
import { Waiter } from '../../src/onisun'

let creature = generateCreatureWithAI(new Waiter())
const map = generateLevel()

beforeEach(() => {
  creature.addToMap(map)
  creature.act(map)
})

it('Does not move', () => {
  const oldPos = creature.pos
  expect(creature.pos).toEqual(oldPos)
})

it('Always available', () => {
  expect(creature.ai.available(creature)).toBeTruthy
})
