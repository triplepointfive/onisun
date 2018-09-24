import {
  generateGame,
  generateLevelMap,
  generateCreatureWithAI,
} from '../helpers'
import { LevelMap, Point, Explorer, Creature } from '../../../src/engine'

describe('Explorer', () => {
  let game = generateGame(),
    map: LevelMap,
    ai: Explorer,
    actor: Creature

  beforeEach(() => {
    ai = new Explorer()
    actor = generateCreatureWithAI(ai)
    game.currentMap = map = generateLevelMap([
      'WWW',
      'WRW',
      'WRW',
      'WRW',
      'WRW',
      'WRW',
      'WWW',
    ])

    map.addCreature(new Point(1, 3), actor)

    const memory = actor.visionMask(map)
    memory.at(1, 1).seen = false
    actor.specie.visionRadius = 1
  })

  it('moves forward to unseen tile', () => {
    actor.act(map, game)
    expect(map.creaturePos(actor).eq(new Point(1, 2))).toBeTruthy()
  })
})
