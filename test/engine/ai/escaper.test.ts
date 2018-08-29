import {
  generateGame,
  generateLevelMap,
  generateCreature,
  generateCreatureWithAI,
} from '../helpers'
import { LevelMap, Creature, Escaper, Point } from '../../../src/engine'

describe('Escaper', () => {
  let game = generateGame(),
    map: LevelMap,
    actor: Creature

  beforeEach(() => {
    game.currentMap = map = generateLevelMap()
    actor = generateCreatureWithAI(new Escaper())
  })

  describe('when there is nobody around', () => {
    beforeEach(() => {
      map.addCreature(new Point(2, 2), actor)

      actor.on = jest.fn()
      actor.act(map, game)
    })

    it('does nothing', () => {
      expect(actor.on.mock.calls.length).toEqual(1)
    })
  })

  describe('with enemy', () => {
    let enemy: Creature

    beforeEach(() => {
      enemy = generateCreature()
    })

    describe('when has free space to run', () => {
      beforeEach(() => {
        map.addCreature(new Point(1, 1), enemy)
        map.addCreature(new Point(2, 2), actor)
        actor.act(map, game)
      })

      it('runs away', () => {
        const newPos = map.creaturePos(actor)
        expect(newPos.x === 3 || newPos.y === 3).toBeTruthy()
      })
    })

    describe('when in dead end', () => {
      beforeEach(() => {
        map.addCreature(new Point(2, 2), enemy)
        map.addCreature(new Point(1, 1), actor)
        actor.act(map, game)
      })

      it('tries to get to safer place', () => {
        const newPos = map.creaturePos(actor)
        expect(newPos.x === 2 || newPos.y === 2).toBeTruthy()
      })
    })
  })
})
