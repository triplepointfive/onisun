import {
  generateGame,
  generatePlayer,
  generateCreature,
  generateLevelMap,
} from '../helpers'
import {
  Game,
  TrapEvent,
  Trap,
  Creature,
  Player,
  Point,
  LevelMap,
  CreatureEvent,
  Reaction,
  Calculator,
} from '../../../src/engine'

class TestTrap extends Trap {
  protected affect(game: Game, levelMap: LevelMap, actor: Creature): void {}

  public buildNew(): TestTrap {
    return this
  }
}

const testTrap = 0

describe('Trap event', () => {
  let player: Player,
    game,
    event,
    map: LevelMap,
    trap: TestTrap,
    dodgeSees: boolean,
    dodgeIsPlayer: boolean,
    activatedSees: boolean,
    activatedIsPlayer: boolean

  beforeEach(() => {
    trap = new TestTrap(false, testTrap)
    game = generateGame()

    game.player = player = generatePlayer()
    game.currentMap = map = generateLevelMap()

    map.addCreature(new Point(1, 1), player)
    player.rebuildVision(map)

    dodgeSees = false
    dodgeIsPlayer = false

    activatedSees = false
    activatedIsPlayer = false

    event = new TrapEvent(
      trap,
      0,
      map,
      game,
      (sees, isPlayer) => ([dodgeSees, dodgeIsPlayer] = [sees, isPlayer]),
      (sees, isPlayer) => {
        ;[activatedSees, activatedIsPlayer] = [sees, isPlayer]
        return Reaction.NOTHING
      }
    )
  })

  describe('for creature', () => {
    let creature: Creature

    beforeEach(() => {
      creature = generateCreature()
      map.addCreature(new Point(1, 2), creature)
    })

    describe('activated', () => {
      afterEach(() => {
        expect(dodgeSees).toBeFalsy()
        expect(dodgeIsPlayer).toBeFalsy()
        expect(activatedIsPlayer).toBeFalsy()
      })

      beforeEach(() => {
        Calculator.dodges = jest.fn()
        Calculator.dodges.mockReturnValueOnce(false)
      })

      it('leaves trap hidden when player does not see', () => {
        map.addCreature(new Point(1, 5), creature)
        player.specie.visionRadius -= 10
        player.rebuildVision(map)

        creature.on(event)
        expect(trap.revealed).toBeFalsy()

        expect(activatedSees).toBeFalsy()
      })

      it('reveals trap when player sees', () => {
        creature.on(event)
        expect(trap.revealed).toBeTruthy()
        expect(activatedSees).toBeTruthy()
      })
    })

    describe('dodges', () => {
      afterEach(() => {
        expect(dodgeIsPlayer).toBeFalsy()
        expect(activatedSees).toBeFalsy()
        expect(activatedIsPlayer).toBeFalsy()
      })

      beforeEach(() => {
        Calculator.dodges = jest.fn()
        Calculator.dodges.mockReturnValueOnce(true)
      })

      it('leaves trap hidden when player does not see', () => {
        map.addCreature(new Point(1, 5), creature)
        player.specie.visionRadius -= 10
        player.rebuildVision(map)

        creature.on(event)
        expect(trap.revealed).toBeFalsy()

        expect(dodgeSees).toBeFalsy()
      })

      it('reveals trap when player sees', () => {
        creature.on(event)
        expect(trap.revealed).toBeTruthy()
        expect(dodgeSees).toBeTruthy()
      })
    })
  })

  describe('for player', () => {
    it('dodges', () => {
      Calculator.dodges = jest.fn()
      Calculator.dodges.mockReturnValueOnce(true)

      player.on(event)
      expect(trap.revealed).toBeTruthy()

      expect(dodgeSees).toBeTruthy()
      expect(dodgeIsPlayer).toBeTruthy()
      expect(activatedSees).toBeFalsy()
      expect(activatedIsPlayer).toBeFalsy()
    })

    it('activated', () => {
      Calculator.dodges = jest.fn()
      Calculator.dodges.mockReturnValueOnce(false)

      player.on(event)
      expect(trap.revealed).toBeTruthy()

      expect(dodgeSees).toBeFalsy()
      expect(dodgeIsPlayer).toBeFalsy()
      expect(activatedSees).toBeTruthy()
      expect(activatedIsPlayer).toBeTruthy()
    })
  })
})
