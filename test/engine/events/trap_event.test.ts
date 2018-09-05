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
} from '../../../src/engine'

class TestTrap extends Trap {
  protected affect(game: Game, levelMap: LevelMap, actor: Creature): void {}

  public buildNew(): TestTrap {
    return this
  }
}

const testTrap = 0

class TestEvent extends CreatureEvent {
  public called: boolean = false

  public affectCreature(): Reaction {
    this.called = true
    return Reaction.NOTHING
  }
}

describe('Trap event', () => {
  let player: Player,
    game,
    event,
    map: LevelMap,
    trap: TestTrap,
    testEvent: TestEvent

  beforeEach(() => {
    trap = new TestTrap(false, testTrap)
    game = generateGame()

    game.player = player = generatePlayer()
    game.currentMap = map = generateLevelMap()

    map.addCreature(new Point(1, 1), player)
    player.rebuildVision(map)

    testEvent = new TestEvent()
    event = new TrapEvent(trap, testEvent, map, game)
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

    it('calls event', () => {
      creature.on(event)
      expect(testEvent.called).toBeTruthy()
    })
  })

  describe('for player', () => {
    it('reveals trap', () => {
      expect(trap.revealed).toBeFalsy()
      player.on(event)
      expect(trap.revealed).toBeTruthy()
    })

    it('calls event', () => {
      player.on(event)
      expect(testEvent.called).toBeTruthy()
    })
  })
})
