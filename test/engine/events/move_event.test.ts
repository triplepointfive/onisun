import {
  Creature,
  Game,
  LevelMap,
  MoveEvent,
  Player,
  Point,
  Trap,
  TriggerTile,
} from '../../../src/engine'
import {
  generateCreature,
  generateGame,
  generateLevelMap,
  generatePlayer,
} from '../helpers'

describe('MoveEvent', () => {
  let game: Game, levelMap: LevelMap, player: Player
  const pos = new Point(1, 1)

  beforeEach(() => {
    game = generateGame()
    game.currentMap = levelMap = generateLevelMap()
    game.player = player = generatePlayer()

    levelMap.addCreature(pos, player)
  })

  describe('player', () => {
    it('going downstairs', () => {
      let secondLevelMap = generateLevelMap()

      player.on(new MoveEvent(game, levelMap, pos, secondLevelMap))

      expect(game.currentMap.name).toEqual(secondLevelMap.name)
      expect(secondLevelMap.creaturePos(player).eq(pos)).toBeTruthy()
    })

    it('stepping on trap', () => {
      let trap = new Trap()
      trap.activate = jest.fn()

      levelMap.setTile(pos.x, pos.y, trap)
      levelMap.addCreature(pos, player)

      player.on(new MoveEvent(game, levelMap, pos))

      expect(trap.activate).toHaveBeenCalled()
    })

    it('stepping on trigger', () => {
      let trigger = new TriggerTile()
      trigger.activate = jest.fn()

      levelMap.setTile(pos.x, pos.y, trigger)
      levelMap.addCreature(pos, player)

      player.on(new MoveEvent(game, levelMap, pos))

      expect(trigger.activate).toHaveBeenCalled()
    })
  })

  describe('creature', () => {
    let creature: Creature

    beforeEach(() => {
      creature = generateCreature()
    })

    it('going downstairs', () => {
      let secondLevelMap = generateLevelMap()

      levelMap.addCreature(new Point(2, 2), creature)

      creature.on(new MoveEvent(game, levelMap, pos, secondLevelMap))

      expect(game.currentMap.name).toEqual(levelMap.name)
      expect(secondLevelMap.creaturePos(creature).eq(pos)).toBeTruthy()
    })
  })
})
