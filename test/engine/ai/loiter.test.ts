import {
  generateGame,
  generateLevelMap,
  generateCreatureWithAI,
} from '../helpers'
import { LevelMap, Creature, Point, Loiter } from '../../../src/engine'

describe('Loiter', () => {
  let game = generateGame(),
    map: LevelMap,
    actor: Creature

  beforeEach(() => {
    game.currentMap = map = generateLevelMap()
    actor = generateCreatureWithAI(new Loiter())

    map.addCreature(new Point(1, 1), actor)

    actor.act(map, game)
  })

  it('moves to random cell around', () => {
    const pos = map.creaturePos(actor)
    expect(pos.x === 2 || pos.y === 2).toBeTruthy()
  })
})
