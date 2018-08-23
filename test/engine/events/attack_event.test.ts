import {
  generateGame,
  generatePlayer,
  generateCreature,
  generateLevelMap,
} from '../helpers'
import {
  Game,
  Player,
  Creature,
  AttackEvent,
  Reaction,
  Point,
} from '../../../src/engine'

describe('AttackEvent', () => {
  let game: Game,
    actor: Player,
    victim: Creature,
    event: AttackEvent,
    map = generateLevelMap()

  beforeEach(() => {
    game = generateGame()
    game.player = actor = generatePlayer()
    victim = generateCreature()
    victim.addToMap(new Point(1, 1), map)
    event = new AttackEvent(actor, game)
  })

  it('victim can dodge', () => {
    actor.characteristics.misses = jest.fn()
    actor.characteristics.misses.mockReturnValueOnce(true)

    expect(victim.on(event)).toEqual(Reaction.DODGE)
    expect(victim.characteristics.health.atMax()).toBeTruthy()
  })

  describe('on success', () => {
    let victimHealth: number

    beforeEach(() => {
      victimHealth = victim.characteristics.health.maximum()

      actor.characteristics.misses = jest.fn()
      actor.characteristics.misses.mockReturnValueOnce(false)
    })

    it('victim can got hurt', () => {
      actor.characteristics.damageTo = jest.fn()
      actor.characteristics.damageTo.mockReturnValueOnce(victimHealth / 2)

      expect(victim.on(event)).toEqual(Reaction.HURT)
      expect(victim.characteristics.health.atMax()).toBeFalsy()

      expect(game.logger.messages.length).toEqual(1)
    })

    it('victim can die', () => {
      actor.characteristics.damageTo = jest.fn()
      actor.characteristics.damageTo.mockReturnValueOnce(victimHealth)

      expect(victim.on(event)).toEqual(Reaction.DIE)
      expect(victim.dead).toBeTruthy()

      expect(game.logger.messages.length).toEqual(1)
    })
  })
})
