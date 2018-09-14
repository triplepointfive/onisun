import {
  generateGame,
  generateLevelMap,
  generatePlayer,
  generateItem,
  generateCreature,
} from '../../helpers'
import {
  LevelMap,
  Game,
  Player,
  FallingRockTrap,
  Room,
  Point,
  Calculator,
} from '../../../../src/engine'

describe('FallingRockTrap', () => {
  let game: Game, levelMap: LevelMap, player: Player, trap: FallingRockTrap

  const newRock = () => generateItem(),
    pos = new Point(1, 1)

  beforeEach(() => {
    game = generateGame()
    game.currentMap = levelMap = generateLevelMap()
    game.player = player = generatePlayer()

    levelMap.addCreature(pos, player)

    Calculator.dodges = jest.fn()
    jest.spyOn(player, 'on')

    trap = new FallingRockTrap(newRock, new Room())
  })

  it('builds new', () => {
    expect(trap.clone()).toBeInstanceOf(FallingRockTrap)
  })

  describe('untrap', () => {
    beforeEach(() => {
      Calculator.chance = jest.fn()

      jest.spyOn(trap, 'activate')
      jest.spyOn(trap, 'disarmTile')
    })

    it('success', () => {
      Calculator.chance.mockReturnValueOnce(false)

      trap.untrap(pos, player, levelMap, game)

      expect(trap.activate).not.toHaveBeenCalled()
      expect(trap.disarmTile).toHaveBeenCalled()
    })

    it('fails with nobody there', () => {
      Calculator.chance.mockReturnValueOnce(true)

      trap.untrap(new Point(2, 2), player, levelMap, game)

      expect(trap.activate).not.toHaveBeenCalled()
      expect(trap.disarmTile).not.toHaveBeenCalled()
      expect(levelMap.at(2, 2).items).toBeDefined()
    })

    it('fails with somebody there', () => {
      Calculator.chance.mockReturnValueOnce(true)

      trap.untrap(pos, player, levelMap, game)

      expect(trap.activate).toHaveBeenCalled()
      expect(trap.disarmTile).not.toHaveBeenCalled()
      expect(levelMap.at(pos.x, pos.y).items).toBeDefined()
    })
  })

  describe('activate', () => {
    it('does nothing when has no more missiles', () => {
      jest.spyOn(player, 'on')
      trap.missilesCount = 0

      trap.activate(pos, game, levelMap, player)

      expect(game.logger.messages.length).toEqual(1)
      expect(player.on).not.toHaveBeenCalled()
    })

    it('hit player with resistance', () => {
      Calculator.dodges.mockReturnValueOnce(false)

      const slot = player.inventory.headSlot,
        mock = jest.spyOn(slot, 'firm', 'get')
      mock.mockReturnValueOnce(true)

      trap.activate(pos, game, levelMap, player)

      expect(game.logger.messages.length).toEqual(1)
      expect(player.on).toHaveBeenCalledTimes(1)
    })

    it('hit creature', () => {
      trap.revealed = true
      Calculator.dodges.mockReturnValueOnce(false)

      let creature = generateCreature()
      jest.spyOn(creature, 'on')

      levelMap.addCreature(new Point(2, 2), creature)

      trap.activate(pos, game, levelMap, creature)

      expect(game.logger.messages.length).toEqual(1)
      expect(creature.on).toHaveBeenCalledTimes(2)
      expect(creature.health.atMax).toBeFalsy()

      expect(levelMap.at(pos.x, pos.y).items).toBeDefined()
      expect(levelMap.at(pos.x, pos.y).items.bunch.length).toEqual(1)
      expect(levelMap.at(pos.x, pos.y).items.bunch[0].count).toEqual(1)
    })

    it('creature dodges', () => {
      const initMissilesCount = trap.missilesCount

      Calculator.dodges.mockReturnValueOnce(true)

      jest.spyOn(game.logger.trapFallingRock, 'dodge')

      let creature = generateCreature()
      jest.spyOn(creature, 'on')

      levelMap.addCreature(new Point(2, 2), creature)

      trap.activate(pos, game, levelMap, creature)

      expect(game.logger.trapFallingRock.dodge).toHaveBeenCalled()
      expect(creature.on).toHaveBeenCalledTimes(1)
      expect(trap.missilesCount).toEqual(initMissilesCount - 1)
    })
  })
})
