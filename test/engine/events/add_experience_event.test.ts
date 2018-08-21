import { generatePlayer, generateCreature, generateGame } from '../helpers'
import {
  Reaction,
  AddExperienceEvent,
  Game,
  AINewLevelEvent,
} from '../../../src/engine'

describe('Drink potion event', () => {
  let actor, event, game: Game

  beforeEach(() => {
    game = generateGame()
  })

  describe('on common creatures', () => {
    beforeEach(() => {
      actor = generateCreature()
      event = new AddExperienceEvent(actor, game)
    })

    it('does nothing', () => {
      expect(actor.on(event)).toEqual(Reaction.NOTHING)
    })
  })

  describe('on player', () => {
    beforeEach(() => {
      game.player = actor = generatePlayer()
      event = new AddExperienceEvent(actor, game)
    })

    it('creates level up event', () => {
      expect(actor.on(event)).toEqual(Reaction.NOTHING)
      expect(actor.ai.events.length).toEqual(1)

      const aiEvent = actor.ai.events[0]

      expect(aiEvent).toBeInstanceOf(AINewLevelEvent)
      expect(aiEvent.level).toEqual(2)
    })
  })
})