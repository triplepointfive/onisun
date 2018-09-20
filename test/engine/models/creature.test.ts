import { generateCreature } from '../helpers'
import { Creature, ImpactType } from '../../../src/engine'

describe('Creature', () => {
  let creature: Creature

  beforeEach(() => {
    creature = generateCreature()
  })

  it('regenerates health', () => {
    creature.health.decrease(creature.health.currentValue - 1)

    for (let i = 0; i < creature.specie.regenerationRate - 1; i++) {
      creature.statsTurn()
    }

    expect(creature.health.currentValue).toEqual(1)
    creature.statsTurn()

    expect(creature.health.currentValue).toEqual(2)
  })

  it('vision radius', () => {
    expect(creature.visionRadius).toBeGreaterThan(0)
    creature.addConstImpact(ImpactType.Blind, 'test')
    expect(creature.visionRadius).toEqual(0)
  })
})
