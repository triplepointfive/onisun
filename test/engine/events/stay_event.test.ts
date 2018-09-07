import { generateCreature, generateLevelMap } from '../helpers'
import {
  Reaction,
  StayEvent,
  Point,
  Creature,
  LevelMap,
  ImpactType,
} from '../../../src/engine'

describe('StayEvent', () => {
  let creature: Creature, map: LevelMap

  beforeEach(() => {
    creature = generateCreature()
    map = generateLevelMap()

    map.addCreature(new Point(1, 1), creature)
  })

  it('does nothing', () => {
    expect(creature.on(new StayEvent(map))).toEqual(Reaction.NOTHING)
  })

  it('when blind', () => {
    creature.addImpact(ImpactType.Blind, 'test')

    expect(creature.on(new StayEvent(map))).toEqual(Reaction.NOTHING)

    const memory = creature.stageMemory(map)
    expect(memory.at(0, 0).see).toBeTruthy()
    expect(memory.at(2, 2).see).toBeTruthy()
  })
})
