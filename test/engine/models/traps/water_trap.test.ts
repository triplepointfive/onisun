import {
  generateGame,
  generateLevelMap,
  generatePlayer,
  generateCreature,
} from '../../helpers'
import {
  Game,
  LevelMap,
  Player,
  WaterTrap,
  Room,
  Calculator,
  Point,
  WaterDamageEvent,
} from '../../../../src/engine'
import { exportAllDeclaration } from 'babel-types'

describe('WaterTrap', () => {
  let game: Game, levelMap: LevelMap, player: Player, trap: WaterTrap
  const pos = new Point(1, 1)

  beforeEach(() => {
    game = generateGame()
    game.currentMap = levelMap = generateLevelMap()
    game.player = player = generatePlayer()

    trap = new WaterTrap(new Room())
  })

  it('builds new', () => {
    expect(trap.clone()).toBeInstanceOf(WaterTrap)
  })

  describe('untrap', () => {
    beforeEach(() => {
      jest.spyOn(trap, 'activate')
      jest.spyOn(trap, 'disarmTile')
    })

    it('fails', () => {
      Calculator.chance = jest.fn(() => true)
      Calculator.dodges = jest.fn(() => true)

      trap.untrap(pos, player, levelMap, game)

      expect(game.logger.messages.length).toEqual(2)
      expect(trap.activate).toHaveBeenCalled()
      expect(trap.disarmTile).not.toHaveBeenCalled()
    })

    it('fails without activation', () => {
      Calculator.chance = jest.fn()
      Calculator.dodges = jest.fn(() => true)

      Calculator.chance.mockReturnValueOnce(true)
      Calculator.chance.mockReturnValueOnce(false)

      trap.untrap(pos, player, levelMap, game)

      expect(game.logger.messages.length).toEqual(1)
      expect(trap.activate).not.toHaveBeenCalled()
      expect(trap.disarmTile).not.toHaveBeenCalled()
    })

    it('success', () => {
      Calculator.chance = jest.fn(() => false)

      trap.untrap(pos, player, levelMap, game)

      expect(game.logger.messages.length).toEqual(1)
      expect(trap.activate).not.toHaveBeenCalled()
      expect(trap.disarmTile).toHaveBeenCalled()
    })
  })

  it('activates player', () => {
    jest.spyOn(player, 'on')
    Calculator.dodges = jest.fn(() => false)

    trap.activate(pos, game, levelMap, player)

    expect(player.on).toHaveBeenCalledTimes(2)
    expect(player.on.mock.calls[1][0]).toBeInstanceOf(WaterDamageEvent)
  })

  it('activates creature', () => {
    trap.revealed = true

    let creature = generateCreature()
    levelMap.addCreature(pos, player)
    levelMap.addCreature(new Point(2, 2), creature)

    jest.spyOn(creature, 'on')
    Calculator.dodges = jest.fn(() => false)

    trap.activate(pos, game, levelMap, creature)

    expect(creature.on).toHaveBeenCalledTimes(2)
    expect(creature.on.mock.calls[1][0]).toBeInstanceOf(WaterDamageEvent)
  })

  it('dodges', () => {
    jest.spyOn(player, 'on')
    Calculator.dodges = jest.fn(() => true)

    trap.activate(pos, game, levelMap, player)

    expect(player.on).toHaveBeenCalledTimes(1)
    expect(game.logger.messages.length).toEqual(1)
  })
})
