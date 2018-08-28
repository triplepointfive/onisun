import {
  generateGame,
  generateLevelMap,
  generateCreature,
  generateCreatureWithAI,
} from '../helpers'
import { LevelMap, Creature, Chaser, Point } from '../../../src/engine'

describe('Chaser', () => {
  let game = generateGame(),
    map: LevelMap,
    actor: Creature,
    enemy: Creature

  beforeEach(() => {
    game.currentMap = map = generateLevelMap()
    actor = generateCreatureWithAI(new Chaser())
    enemy = generateCreature()

    map.addCreature(new Point(1, 1), enemy)
  })

  describe('when enemy is few cell away', () => {
    beforeEach(() => {
      map.addCreature(new Point(1, 4), actor)
      actor.act(map, game)
      actor.act(map, game)
    })

    it('runs to enemy', () => {
      expect(map.creaturePos(actor).eq(new Point(1, 2))).toBeTruthy()
    })
  })

  describe('when enemy is one cell away', () => {
    beforeEach(() => {
      map.addCreature(new Point(3, 3), actor)
      actor.act(map, game)
    })

    it('runs to enemy', () => {
      expect(map.creaturePos(actor).eq(new Point(2, 2))).toBeTruthy()
    })
  })

  describe('when enemy is next cell', () => {
    beforeEach(() => {
      map.addCreature(new Point(2, 2), actor)

      actor.on = jest.fn()
      actor.act(map, game)
    })

    it('does nothing', () => {
      expect(actor.on.mock.calls.length).toEqual(0)
    })
  })
})
