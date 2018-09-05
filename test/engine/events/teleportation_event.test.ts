import {
  generateGame,
  generatePlayer,
  generateLevelMap,
  generateCreature,
} from '../helpers'
import {
  Player,
  LevelMap,
  Point,
  Creature,
  TeleportationEvent,
} from '../../../src/engine'

describe('TeleportationEvent', () => {
  let player: Player, game, event, map: LevelMap

  beforeEach(() => {
    game = generateGame()

    game.player = player = generatePlayer()
    game.currentMap = map = generateLevelMap()

    map.addCreature(new Point(0, 0), player) // Adding to wall to exclude starting position

    event = new TeleportationEvent(map, game, false)
  })

  describe('for creature', () => {
    let creature: Creature

    beforeEach(() => {
      creature = generateCreature()
      map.addCreature(new Point(0, 1), creature)
      player.rebuildVision(map)
    })

    it('changes position', () => {
      const oldPos = map.creaturePos(creature)
      creature.on(event)
      expect(map.creaturePos(creature)).not.toEqual(oldPos)
    })

    it('player does not see - no messages', () => {
      creature.on(event)
      expect(game.logger.messages.length).toEqual(0)
    })
  })

  describe('for player', () => {
    it('changes position', () => {
      const oldPos = map.creaturePos(player)
      player.on(event)
      expect(map.creaturePos(player)).not.toEqual(oldPos)
    })

    it('adds a message to log', () => {
      expect(game.logger.messages.length).toEqual(0)
      player.on(event)
      expect(game.logger.messages.length).toEqual(1)
    })
  })
})
