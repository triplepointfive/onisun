import {
  AfterEvent,
  ImpactType,
  Player,
  Point,
  Reaction,
} from '../../../src/engine'
import { generateGame, generateLevelMap, generatePlayer } from '../helpers'

describe('AfterEvent', () => {
  let creature: Player,
    event: AfterEvent,
    game = generateGame()

  beforeEach(() => {
    creature = generatePlayer()
    const map = generateLevelMap()
    map.addCreature(new Point(1, 1), creature)

    event = new AfterEvent(map, game)
  })

  describe('when had negative impacts', () => {
    beforeEach(() => {
      creature.addImpact(ImpactType.Overloaded, 'bag')
      creature.addImpact(ImpactType.Loaded, 'bag')
      creature.addImpact(ImpactType.Stressed, 'bag')

      expect(creature.on(event)).toEqual(Reaction.Nothing)
    })

    it('removes them all', () => {
      expect(creature.impacts).toEqual([])
    })
  })

  describe('when has some load', () => {
    beforeEach(() => {
      Object.defineProperty(creature.carryingCapacity, 'flattenedStart', {
        get: jest.fn(() => 25),
      })

      Object.defineProperty(creature.carryingCapacity, 'overloadedStart', {
        get: jest.fn(() => 20),
      })

      Object.defineProperty(creature.carryingCapacity, 'loadedStart', {
        get: jest.fn(() => 15),
      })

      Object.defineProperty(creature.carryingCapacity, 'stressed', {
        get: jest.fn(() => 10),
      })
    })

    it('does not add anything if load is low', () => {
      Object.defineProperty(creature.stuffWeight, 'current', {
        get: jest.fn(() => 10),
      })

      expect(creature.on(event)).toEqual(Reaction.Nothing)
      expect(creature.impacts).toEqual([])
    })

    it('adds stressed impact', () => {
      Object.defineProperty(creature.stuffWeight, 'current', {
        get: jest.fn(() => 11),
      })

      expect(creature.on(event)).toEqual(Reaction.Nothing)
      expect(creature.impacts).toEqual([ImpactType.Stressed])
    })

    it('adds stressed loaded', () => {
      Object.defineProperty(creature.stuffWeight, 'current', {
        get: jest.fn(() => 16),
      })

      expect(creature.on(event)).toEqual(Reaction.Nothing)
      expect(creature.impacts).toEqual([ImpactType.Loaded])
    })

    it('adds stressed overloaded', () => {
      Object.defineProperty(creature.stuffWeight, 'current', {
        get: jest.fn(() => 21),
      })

      expect(creature.on(event)).toEqual(Reaction.Nothing)
      expect(creature.impacts).toEqual([ImpactType.Overloaded])
    })

    it('kills when flattened', () => {
      Object.defineProperty(creature.stuffWeight, 'current', {
        get: jest.fn(() => 26),
      })

      expect(creature.on(event)).toEqual(Reaction.Die)
      expect(creature.dead).toBeTruthy()
    })
  })
})
