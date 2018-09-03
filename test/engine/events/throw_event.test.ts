import {
  generateCreature,
  generateGame,
  generateLevelMap,
  generateMissile,
} from '../helpers'
import {
  Reaction,
  ThrowEvent,
  Creature,
  LevelMap,
  Game,
  Point,
  Missile,
} from '../../../src/engine'

describe('StayEvent', () => {
  let actor: Creature,
    victim: Creature,
    event: ThrowEvent,
    map: LevelMap,
    game: Game,
    missile: Missile

  beforeEach(() => {
    game = generateGame()
    game.currentMap = map = generateLevelMap()

    actor = generateCreature()
    victim = generateCreature()

    map.addCreature(new Point(1, 1), actor)
    map.addCreature(new Point(3, 3), victim)

    missile = generateMissile()

    event = new ThrowEvent(victim, missile, map, game)
  })

  describe('when victim dodges', () => {
    beforeEach(() => {
      actor.characteristics.throwMisses = jest.fn()
      actor.characteristics.throwMisses.mockReturnValueOnce(true)

      expect(actor.on(event)).toEqual(Reaction.THROW_DODGE)
    })

    it('logs a message', () => {
      expect(game.logger.messages.length).toEqual(1)
    })
  })

  describe('when victim failed to dodge', () => {
    beforeEach(() => {
      actor.characteristics.throwMisses = jest.fn()
      actor.characteristics.throwMisses.mockReturnValueOnce(false)
    })

    describe('actor does damage', () => {
      beforeEach(() => {
        actor.characteristics.throwDamageTo = jest.fn()
        actor.characteristics.throwDamageTo.mockReturnValueOnce(1)

        expect(actor.on(event)).toEqual(Reaction.HURT)
      })

      it('decreases health level', () => {
        expect(victim.health.atMax).toBeFalsy()
      })

      it('logs a message', () => {
        expect(game.logger.messages.length).toEqual(1)
      })
    })

    describe('actor kills', () => {
      beforeEach(() => {
        actor.characteristics.throwDamageTo = jest.fn()
        actor.characteristics.throwDamageTo.mockReturnValueOnce(
          victim.health.maximum
        )

        expect(actor.on(event)).toEqual(Reaction.DIE)
      })

      it('victim dies', () => {
        expect(victim.dead).toBeTruthy()
      })

      it('logs a message', () => {
        expect(game.logger.messages.length).toEqual(1)
      })
    })
  })
})
