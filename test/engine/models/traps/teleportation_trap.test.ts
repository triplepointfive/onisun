import { generatePlayer, generateCreature, generateGame, generateLevelMap } from '../../helpers'
import { TeleportationTrap, Player, Calculator, Game, LevelMap, Point } from '../../../../src/engine'

describe('TeleportationTrap', () => {
  let trap: TeleportationTrap, player: Player, game: Game, map: LevelMap

  beforeEach(() => {
    game = generateGame()
    game.currentMap = map = generateLevelMap()
    game.player = player = generatePlayer()
    map.addCreature(new Point(1, 1), player)

    Calculator.dodges = jest.fn()

    player.rebuildVision(map)

    trap = new TeleportationTrap()
  })

  describe('creature', () => {
    let creature, mock

    beforeEach(() => {
      creature = generateCreature()
      map.addCreature(new Point(2, 2), creature)

      mock = jest.spyOn(creature, 'on')
    })

    it('activates', () => {
      Calculator.dodges.mockReturnValueOnce(false)

      trap.activate(game, map, creature)
      expect(mock).toHaveBeenCalledTimes(3)
      expect(game.logger.messages.length).toEqual(1)
    })

    it('dodges when seen', () => {
      Calculator.dodges.mockReturnValueOnce(true)
      trap.activate(game, map, creature)

      expect(mock).toHaveBeenCalledTimes(1)
      expect(game.logger.messages.length).toEqual(1)
    })

    it('dodges when unseen', () => {
      map.removeCreature(player)
      map.addCreature(new Point(0, 0), player)
      player.rebuildVision(map)

      Calculator.dodges.mockReturnValueOnce(true)
      trap.activate(game, map, creature)

      expect(mock).toHaveBeenCalledTimes(1)
      expect(game.logger.messages.length).toEqual(0)
    })
  })

  describe('player', () => {
    let mock

    beforeEach(() => {
      mock = jest.spyOn(player, 'on')
    })

    it('activates', () => {
      Calculator.dodges.mockReturnValueOnce(false)
      trap.activate(game, map, player)

      expect(mock).toHaveBeenCalledTimes(3)
      expect(game.logger.messages.length).toEqual(1)
    })

    it('dodges', () => {
      Calculator.dodges.mockReturnValueOnce(true)
      trap.activate(game, map, player)

      expect(mock).toHaveBeenCalledTimes(1)
      expect(game.logger.messages.length).toEqual(1)
    })
  })
})
