import { generateCreature } from '../helpers'
import { Reaction, StayEvent } from '../../../src/engine'

describe('StayEvent', () => {
  let creature = generateCreature()

  it('does nothing', () => {
    expect(creature.on(new StayEvent())).toEqual(Reaction.NOTHING)
  })
})
