import {
  generateGame,
  generateLevelMap,
  generatePlayer,
  generateCreature,
} from '../../helpers'
import {
  Game,
  HoleTrap,
  LevelMap,
  Player,
  Room,
  Point,
  Creature,
  Calculator,
  StayEvent,
  StairwayDown,
  MoveEvent,
  HurtEvent,
} from '../../../../src/engine'

describe('HoleTrap', () => {
  let trap: HoleTrap,
    levelMap: LevelMap,
    game: Game,
    player: Player,
    pos = new Point(1, 1)

  beforeEach(() => {
    game = generateGame()
    game.player = player = generatePlayer()
    game.currentMap = levelMap = generateLevelMap()

    levelMap.addCreature(pos, player)

    Calculator.dodges = jest.fn()

    trap = new HoleTrap(new Room())
  })

  it('builds new', () => {
    expect(trap.clone()).toBeInstanceOf(HoleTrap)
  })

  it('disarm fails', () => {
    levelMap.setTile(1, 2, trap)

    trap.untrap(new Point(1, 2), player, levelMap, game)

    expect(levelMap.at(1, 2)).toEqual(trap)
    expect(game.logger.messages.length).toEqual(1)
  })

  describe('with second floor', () => {
    let secondFloor: LevelMap

    beforeEach(() => {
      secondFloor = generateLevelMap()
      game.addMap(secondFloor.id, () => secondFloor)

      levelMap.setTile(2, 2, new StairwayDown(levelMap, secondFloor.id))
    })

    describe('for creature', () => {
      let creature: Creature

      beforeEach(() => {
        creature = generateCreature()
        levelMap.addCreature(new Point(1, 2), creature)
        jest.spyOn(creature, 'on')
      })

      it('when hit', () => {
        Calculator.dodges.mockReturnValueOnce(false)
        trap.activate(pos, game, levelMap, creature)
        expect(game.logger.messages.length).toEqual(1)

        expect(creature.on).toHaveBeenCalledTimes(3)
        expect(creature.on.mock.calls[1][0]).toBeInstanceOf(MoveEvent)
        expect(creature.on.mock.calls[2][0]).toBeInstanceOf(HurtEvent)

        const secondFloorPos = secondFloor.creaturePos(creature)
        expect(secondFloorPos).toBeDefined()

        expect(
          secondFloor.at(secondFloorPos.x, secondFloorPos.y).free
        ).toBeTruthy()
      })
    })

    describe('for player', () => {
      beforeEach(() => {
        trap.revealed = true
        jest.spyOn(player, 'on')
      })

      it('when hit', () => {
        Calculator.dodges.mockReturnValueOnce(false)
        trap.activate(pos, game, levelMap, player)
        expect(game.logger.messages.length).toEqual(1)

        expect(player.on).toHaveBeenCalledTimes(3)
        expect(player.on.mock.calls[1][0]).toBeInstanceOf(MoveEvent)
        expect(player.on.mock.calls[2][0]).toBeInstanceOf(HurtEvent)

        const secondFloorPos = secondFloor.creaturePos(player)
        expect(secondFloorPos).toBeDefined()

        expect(
          secondFloor.at(secondFloorPos.x, secondFloorPos.y).free
        ).toBeTruthy()
      })
    })
  })

  describe('without second floor', () => {
    beforeEach(() => {
      const secondFloor = generateLevelMap(['W'])
      game.addMap(secondFloor.id, () => secondFloor)
      levelMap.setTile(2, 2, new StairwayDown(levelMap, secondFloor.id))
    })

    describe('for creature', () => {
      let creature: Creature

      beforeEach(() => {
        creature = generateCreature()
        levelMap.addCreature(new Point(1, 2), creature)
        jest.spyOn(creature, 'on')
      })

      it('when dodges', () => {
        Calculator.dodges.mockReturnValueOnce(true)
        trap.activate(pos, game, levelMap, creature)
        expect(game.logger.messages.length).toEqual(1)
        expect(creature.on).toHaveBeenCalledTimes(1)
      })

      it('when hit', () => {
        Calculator.dodges.mockReturnValueOnce(false)
        trap.activate(pos, game, levelMap, creature)
        expect(game.logger.messages.length).toEqual(1)
        expect(creature.on).toHaveBeenCalledTimes(2)
        expect(creature.on.mock.calls[1][0]).toBeInstanceOf(StayEvent)
      })
    })

    describe('for player', () => {
      beforeEach(() => {
        trap.revealed = true
        jest.spyOn(player, 'on')
      })

      it('when dodges', () => {
        Calculator.dodges.mockReturnValueOnce(true)
        trap.activate(pos, game, levelMap, player)
        expect(game.logger.messages.length).toEqual(1)
        expect(player.on).toHaveBeenCalledTimes(1)
      })

      it('when hit', () => {
        Calculator.dodges.mockReturnValueOnce(false)
        trap.activate(pos, game, levelMap, player)
        expect(game.logger.messages.length).toEqual(1)
        expect(player.on).toHaveBeenCalledTimes(2)
        expect(player.on.mock.calls[1][0]).toBeInstanceOf(StayEvent)
      })
    })
  })
})
