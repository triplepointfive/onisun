import {
  generatePlayer,
  generateCreature,
  generateGame,
  generateLevelMap,
  testTiles,
} from '../../helpers'
import {
  TeleportationTrap,
  Player,
  Calculator,
  Game,
  LevelMap,
  Point,
  Room,
} from '../../../../src/engine'

describe('TeleportationTrap', () => {
  let trap: TeleportationTrap, player: Player, game: Game, map: LevelMap

  beforeEach(() => {
    game = generateGame()
    game.currentMap = map = generateLevelMap()
    game.player = player = generatePlayer()
    map.addCreature(new Point(1, 1), player)

    Calculator.dodges = jest.fn()

    trap = new TeleportationTrap(new Room())
  })

  it('buildNew', () => {
    expect(trap.clone()).toBeInstanceOf(TeleportationTrap)
  })

  it('disarm fails', () => {
    map.setTile(1, 2, trap)

    trap.untrap(new Point(1, 2), player, map, game)

    expect(map.at(1, 2)).toEqual(trap)
    expect(game.logger.messages.length).toEqual(1)
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
