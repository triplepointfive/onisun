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
} from '../../../src/engine'

class TestTrap extends Trap {
  protected affect(game: Game, actor: Creature): void {}

  public buildNew(): TestTrap {
    return this
  }
}

const testTrap = 0

describe('Trap event', () => {
  let player: Player, game, event, map: LevelMap, trap: TestTrap

  beforeEach(() => {
    trap = new TestTrap(false, testTrap)
    game = generateGame()
    event = new TrapEvent(trap, game)

    game.player = player = generatePlayer()
    game.currentMap = map = generateLevelMap()

    map.addCreature(new Point(1, 1), player)
    player.rebuildVision(map)
  })

  describe('for creature', () => {
    let creature: Creature

    beforeEach(() => {
      creature = generateCreature()
      map.addCreature(new Point(1, 2), creature)
    })

    it('leaves trap hidden when player does not see', () => {
      map.addCreature(new Point(1, 5), creature)
      player.characteristics.radius.decrease(10)
      player.rebuildVision(map)

      expect(trap.revealed).toBeFalsy()
      creature.on(event)
      expect(trap.revealed).toBeFalsy()
    })

    it('reveals trap when player sees', () => {
      expect(trap.revealed).toBeFalsy()
      creature.on(event)
      expect(trap.revealed).toBeTruthy()
    })

    it('does damage', () => {
      expect(creature.characteristics.health.atMax()).toBeTruthy()
      creature.on(event)
      expect(creature.characteristics.health.atMax()).toBeFalsy()
    })

    it('may even kill', () => {
      creature.characteristics.health.decrease(
        player.characteristics.health.maximum() - 1
      )
      creature.on(event)
      expect(creature.dead).toBeTruthy()
    })

    it('adds a message to log', () => {
      expect(game.logger.messages.length).toEqual(0)
      creature.on(event)
      expect(game.logger.messages.length).toEqual(1)
    })
  })

  describe('for player', () => {
    it('reveals trap', () => {
      expect(trap.revealed).toBeFalsy()
      player.on(event)
      expect(trap.revealed).toBeTruthy()
    })

    it('does damage', () => {
      expect(player.characteristics.health.atMax()).toBeTruthy()
      player.on(event)
      expect(player.characteristics.health.atMax()).toBeFalsy()
    })

    it('adds a message to log', () => {
      expect(game.logger.messages.length).toEqual(0)
      player.on(event)
      expect(game.logger.messages.length).toEqual(1)
    })
  })
})
