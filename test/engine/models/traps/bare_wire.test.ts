import {
  generateGame,
  generateLevelMap,
  generatePlayer,
  generateCreature,
} from '../../helpers'
import {
  Game,
  Player,
  LevelMap,
  BareWireTrap,
  Room,
  Calculator,
  Creature,
  HurtEvent,
  Point,
} from '../../../../src/engine'

describe('BareWire', () => {
  let levelMap: LevelMap, game: Game, player: Player, trap: BareWireTrap

  beforeEach(() => {
    game = generateGame()
    game.currentMap = levelMap = generateLevelMap()
    game.player = player = generatePlayer()

    levelMap.addCreature(new Point(1, 1), player)

    Calculator.dodges = jest.fn()

    jest.spyOn(player, 'on')

    trap = new BareWireTrap(new Room())
  })

  it('builds new', () => {
    expect(trap.clone()).toBeInstanceOf(BareWireTrap)
  })

  describe('activate', () => {
    it('dodges', () => {
      Calculator.dodges.mockReturnValueOnce(true)

      trap.activate(game, levelMap, player)

      expect(player.on).not.toHaveBeenCalled()
      expect(trap.revealed).toBeFalsy()
    })

    describe('creature activates', () => {
      let creature: Creature

      beforeEach(() => {
        creature = generateCreature()
        levelMap.addCreature(new Point(2, 2), creature)

        Calculator.dodges.mockReturnValueOnce(false)

        jest.spyOn(creature, 'on')
      })

      it('hit', () => {
        trap.activate(game, levelMap, creature)

        expect(trap.revealed).toBeTruthy()
        expect(creature.on).toHaveBeenCalledTimes(2)
        expect(creature.on.mock.calls[1][0]).toBeInstanceOf(HurtEvent)
      })
    })

    describe('player activates', () => {
      beforeEach(() => {
        Calculator.dodges.mockReturnValueOnce(false)
        trap.revealed = true
      })

      it('hit without protection', () => {
        trap.activate(game, levelMap, player)

        expect(player.on).toHaveBeenCalledTimes(2)
        expect(player.on.mock.calls[1][0]).toBeInstanceOf(HurtEvent)
      })

      it('resists when legs are protected', () => {
        const slot = player.inventory.bootsSlot,
          mock = jest.spyOn(slot, 'insulator', 'get')

        mock.mockReturnValueOnce(true)

        trap.activate(game, levelMap, player)
        expect(player.on).toHaveBeenCalledTimes(1)
      })
    })
  })
})
