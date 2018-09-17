import {
  generateGame,
  generatePlayer,
  generateLevelMap,
  generateOneHandedWeapon,
  generateCreature,
} from '../../helpers'
import {
  LevelMap,
  Player,
  Game,
  AirBlowTrap,
  Room,
  Calculator,
  Point,
} from '../../../../src/engine'

describe('AirBlowTrap', () => {
  let game: Game, levelMap: LevelMap, player: Player, trap: AirBlowTrap
  const pos = new Point(1, 1)

  beforeEach(() => {
    game = generateGame()
    game.player = player = generatePlayer()
    game.currentMap = levelMap = generateLevelMap()

    trap = new AirBlowTrap(new Room())
  })

  it('builds new', () => {
    expect(trap.clone()).toBeInstanceOf(AirBlowTrap)
  })

  describe('untrap', () => {
    beforeEach(() => {
      jest.spyOn(trap, 'activate')
      jest.spyOn(trap, 'disarmTile')
    })

    it('fails with activation', () => {
      Calculator.chance = jest.fn(() => true)
      Calculator.dodges = jest.fn(() => true)

      trap.untrap(pos, player, levelMap, game)

      expect(game.logger.messages.length).toEqual(2)
      expect(trap.activate).toHaveBeenCalled()
      expect(trap.disarmTile).not.toHaveBeenCalled()
    })

    it('fails without activation', () => {
      Calculator.chance = jest.fn()
      Calculator.chance.mockReturnValueOnce(true)
      Calculator.chance.mockReturnValueOnce(false)

      Calculator.dodges = jest.fn(() => true)

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

  describe('activates', () => {
    beforeEach(() => {
      jest.spyOn(player, 'on')
    })

    it('dodges', () => {
      jest.spyOn(game.logger.trapAirBlow, 'dodge')

      Calculator.dodges = jest.fn(() => true)
      trap.activate(pos, game, levelMap, player)

      expect(game.logger.trapAirBlow.dodge).toHaveBeenCalled()
      expect(player.on).toHaveBeenCalledTimes(1)
    })

    it('moves player', () => {
      levelMap.addCreature(pos, player)
      player.specie.weight = trap.creatureWeightBlowThreshold - 1

      Calculator.dodges = jest.fn(() => false)
      trap.activate(pos, game, levelMap, player)

      expect(player.on).toHaveBeenCalledTimes(2)
      const newPos = levelMap.creaturePos(player)
      expect(pos.eq(newPos)).toBeFalsy()
    })

    it('resist with weight for non player', () => {
      trap.revealed = true
      let creature = generateCreature()

      levelMap.addCreature(pos, creature)
      levelMap.addCreature(new Point(1, 2), player)
      creature.specie.weight = trap.creatureWeightBlowThreshold + 1
      jest.spyOn(creature, 'on')

      Calculator.dodges = jest.fn(() => false)
      trap.activate(pos, game, levelMap, creature)

      expect(creature.on).toHaveBeenCalledTimes(1)
      const newPos = levelMap.creaturePos(creature)
      expect(pos.eq(newPos)).toBeTruthy()
    })

    it('resist when nowhere to move', () => {
      levelMap = generateLevelMap(['WWW', 'WRW', 'WWW'])
      levelMap.addCreature(pos, player)
      player.specie.weight = trap.creatureWeightBlowThreshold - 1

      Calculator.dodges = jest.fn(() => false)
      trap.activate(pos, game, levelMap, player)

      expect(player.on).toHaveBeenCalledTimes(1)
      const newPos = levelMap.creaturePos(player)
      expect(pos.eq(newPos)).toBeTruthy()
    })

    it('blows both hands and hat', () => {
      levelMap.addCreature(pos, player)
      player.specie.weight = trap.creatureWeightBlowThreshold + 1

      player.inventory.rightHandSlot.equipment = {
        item: generateOneHandedWeapon(),
        count: 1,
      }
      player.inventory.leftHandSlot.equipment = {
        item: generateOneHandedWeapon(),
        count: 1,
      }
      player.inventory.headSlot.equipment = {
        item: generateOneHandedWeapon(),
        count: 1,
      }

      Calculator.dodges = jest.fn(() => false)
      Calculator.chance = jest.fn(() => true)
      trap.activate(pos, game, levelMap, player)

      expect(player.on).toHaveBeenCalledTimes(7)

      expect(player.inventory.rightHandSlot.equipment).toBeUndefined()
      expect(player.inventory.leftHandSlot.equipment).toBeUndefined()
      expect(player.inventory.headSlot.equipment).toBeUndefined()
    })
  })
})
