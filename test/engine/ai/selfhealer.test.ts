import {
  generateCreatureWithAI,
  generateLevelMap,
  generateGame,
} from '../helpers'
import { SelfHealer, Point } from '../../../src/engine'

let creature = generateCreatureWithAI(new SelfHealer())
const map = generateLevelMap(),
  game = generateGame()

beforeEach(() => {
  map.addCreature(new Point(1, 1), creature)
})

describe('With full health', () => {
  it('Is not available', () => {
    expect(creature.ai.act(creature, map, game)).toBeFalsy()
  })

  it('Does nothing', () => {
    expect(creature.characteristics.health.atMax).toBeTruthy()
  })
})

describe('When health is not full', () => {
  beforeEach(() => {
    creature.characteristics.health.decrease(10)
  })

  it('Available', () => {
    expect(creature.ai.act(creature, map, game)).toBeTruthy()
  })
})
