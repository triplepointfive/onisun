import { generateGame, generatePlayer, generateLevelMap } from '../../helpers'
import {
  Game,
  Player,
  LevelMap,
  LightTrap,
  Room,
  Point,
  Calculator,
  ImpactType,
} from '../../../../src/engine'

describe('LightTrap', () => {
  let game: Game, levelMap: LevelMap, player: Player, trap: LightTrap
  const pos = new Point(1, 1)

  beforeEach(() => {
    game = generateGame()
    game.currentMap = levelMap = generateLevelMap()
    game.player = player = generatePlayer()

    levelMap.addCreature(pos, player)

    trap = new LightTrap(new Room())
  })

  it('build new', () => {
    expect(trap.clone()).toBeInstanceOf(LightTrap)
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

    it('success', () => {
      Calculator.chance = jest.fn(() => false)

      trap.untrap(pos, player, levelMap, game)

      expect(game.logger.messages.length).toEqual(1)
      expect(trap.activate).not.toHaveBeenCalled()
      expect(trap.disarmTile).toHaveBeenCalled()
    })
  })

  describe('activates', () => {
    beforeEach(() => {
      jest.spyOn(player, 'on')
    })

    it('player being already blind', () => {
      trap.revealed = true

      Calculator.dodges = jest.fn(() => false)

      player.addImpact(ImpactType.Blind, 'test')

      trap.activate(pos, game, levelMap, player)

      expect(player.on).toHaveBeenCalledTimes(1)
    })

    it('player', () => {
      Calculator.dodges = jest.fn(() => false)

      trap.activate(pos, game, levelMap, player)

      expect(player.on).toHaveBeenCalledTimes(2)
      expect(player.hasImpact(ImpactType.Blind)).toBeTruthy()
    })
  })
})
