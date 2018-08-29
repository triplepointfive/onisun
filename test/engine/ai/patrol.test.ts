import {
  generateGame,
  generateLevelMap,
  generateCreatureWithAI,
} from '../helpers'
import { LevelMap, Point, Patrol, Creature } from '../../../src/engine'

describe('Patrol', () => {
  let game = generateGame(),
    map: LevelMap,
    ai: Patrol,
    actor: Creature

  beforeEach(() => {
    ai = new Patrol()
    actor = generateCreatureWithAI(ai)
    game.currentMap = map = generateLevelMap()

    map.addCreature(new Point(1, 1), actor)
  })

  describe('when no nodes', () => {
    beforeEach(() => {
      actor.on = jest.fn()
      actor.act(map, game)
    })

    it('does nothing', () => {
      expect(actor.on.mock.calls.length).toEqual(1)
    })
  })

  describe('when multiple nodes', () => {
    beforeEach(() => {
      ai.trackMovement(new Point(1, 1), map.at(1, 1))
      // 10 = NEW_POINT_EVERY
      for (let i = 0; i < 10; i++) {
        ai.trackMovement(new Point(1, 5), map.at(1, 1))
      }
    })

    it('moves from one to another', () => {
      actor.act(map, game)
      expect(map.creaturePos(actor).eq(new Point(1, 2))).toBeTruthy()
    })

    it('moves to first one when reached last', () => {
      map.addCreature(new Point(1, 5), actor)
      actor.act(map, game)
      expect(map.creaturePos(actor).eq(new Point(1, 4))).toBeTruthy()
    })
  })
})
