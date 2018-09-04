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
  LevelMap,
  Calculator,
} from '../../../src/engine'

describe('AttackEvent', () => {
  let game: Game,
    actor: Player,
    victim: Creature,
    event: AttackEvent,
    map: LevelMap

  beforeEach(() => {
    game = generateGame()
    game.currentMap = map = generateLevelMap()
    game.player = actor = generatePlayer()

    victim = generateCreature()
    map.addCreature(new Point(1, 1), victim)

    event = new AttackEvent(victim, map, game)
  })

  it('victim can dodge', () => {
    Calculator.misses = jest.fn()
    Calculator.misses.mockReturnValueOnce(true)

    expect(actor.on(event)).toEqual(Reaction.DODGE)
    expect(victim.health.atMax).toBeTruthy()
  })

  describe('on success', () => {
    let victimHealth: number

    beforeEach(() => {
      victimHealth = victim.health.maximum

      Calculator.misses = jest.fn()
      Calculator.misses.mockReturnValueOnce(false)
    })

    it('victim can got hurt', () => {
      Calculator.damage = jest.fn()
      Calculator.damage.mockReturnValueOnce({
        damage: victimHealth / 2,
        resist: false,
      })

      expect(actor.on(event)).toEqual(Reaction.HURT)
      expect(victim.health.atMax).toBeFalsy()

      expect(game.logger.messages.length).toEqual(1)
    })

    it('victim can die', () => {
      Calculator.damage = jest.fn()
      Calculator.damage.mockReturnValueOnce({
        damage: victimHealth,
        resist: false,
      })

      expect(actor.on(event)).toEqual(Reaction.DIE)
      expect(victim.dead).toBeTruthy()

      expect(game.logger.messages.length).toEqual(1)
    })
  })
})
