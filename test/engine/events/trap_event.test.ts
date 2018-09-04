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
  protected affect(game: Game, levelMap: LevelMap, actor: Creature): void {}

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

    game.player = player = generatePlayer()
    game.currentMap = map = generateLevelMap()

    map.addCreature(new Point(1, 1), player)
    player.rebuildVision(map)
    event = new TrapEvent(trap, map, game)
  })

  describe('for creature', () => {
    let creature: Creature

    beforeEach(() => {
      creature = generateCreature()
      map.addCreature(new Point(1, 2), creature)
    })

    it('leaves trap hidden when player does not see', () => {
      map.addCreature(new Point(1, 5), creature)
      player.specie.visionRadius -= 10
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
      expect(creature.health.atMax).toBeTruthy()
      creature.on(event)
      expect(creature.health.atMax).toBeFalsy()
    })

    it('may even kill', () => {
      creature.health.decrease(player.health.maximum - 1)
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
      expect(player.health.atMax).toBeTruthy()
      player.on(event)
      expect(player.health.atMax).toBeFalsy()
    })

    it('adds a message to log', () => {
      expect(game.logger.messages.length).toEqual(0)
      player.on(event)
      expect(game.logger.messages.length).toEqual(1)
    })
  })
})
