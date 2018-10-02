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
    Calculator.misses = jest.fn(() => true)

    expect(victim.on(new AttackEvent(actor, map, game))).toEqual(Reaction.DODGE)
    expect(actor.health.atMax).toBeTruthy()
  })

  describe('on success', () => {
    let victimHealth: number

    beforeEach(() => {
      victimHealth = victim.health.maximum

      Calculator.misses = jest.fn(() => false)

      jest.spyOn(actor, 'on')
    })

    it('victim can got hurt', () => {
      Calculator.damage = jest.fn(() => {
        return {
          damage: victimHealth / 2,
          resist: false,
        }
      })

      expect(actor.on(event)).toEqual(Reaction.HURT)
      expect(victim.health.atMax).toBeFalsy()
    })

    it('victim can die', () => {
      Calculator.damage = jest.fn(() => {
        return {
          damage: victimHealth,
          resist: false,
        }
      })

      expect(actor.on(event)).toEqual(Reaction.DIE)
      expect(victim.dead).toBeTruthy()
      expect(actor.killStat.total).toEqual(1)
    })
  })
})
