import { generateCreatureWithAI, generateLevel } from '../helpers'
import { SelfHealer, Point } from '../../src/engine'

let creature = generateCreatureWithAI(new SelfHealer())
const map = generateLevel()

beforeEach(() => {
  creature.addToMap(new Point(1, 1), map)
})

describe('With full health', () => {
  it('Is not available', () => {
    expect(creature.ai.available(creature)).toBeFalsy()
  })

  it('Does nothing', () => {
    expect(creature.characteristics.health.atMax()).toBeTruthy()
  })
})

describe('When health is not full', () => {
  beforeEach(() => {
    creature.characteristics.health.decrease(10)
  })

  it('Available', () => {
    expect(creature.ai.available(creature)).toBeTruthy()
  })

  it.skip('Regenerates health', () => {
    const oldHealth = creature.characteristics.health.currentValue()
    creature.act(map)
    expect(creature.characteristics.health.currentValue()).toBeGreaterThan(
      oldHealth
    )
  })
})
