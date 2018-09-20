import {
  generatePlayer,
  generateCreature,
  generateGame,
  generateLevelMap,
} from '../helpers'
import {
  Reaction,
  AddExperienceEvent,
  Game,
  AINewLevelEvent,
} from '../../../src/engine'

describe('Drink potion event', () => {
  let actor,
    event,
    game: Game,
    map = generateLevelMap()

  beforeEach(() => {
    game = generateGame()
  })

  describe('on player', () => {
    beforeEach(() => {
      game.player = actor = generatePlayer()
      event = new AddExperienceEvent(actor, map, game)
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
