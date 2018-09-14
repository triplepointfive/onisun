import {
  generateGame,
  generateLevelMap,
  generateCreatureWithAI,
} from '../helpers'
import {
  LevelMap,
  Creature,
  Descender,
  Point,
  StairwayDown,
  StairwayUp,
} from '../../../src/engine'

describe('Descender', () => {
  let game = generateGame(),
    map: LevelMap,
    adjustMap: LevelMap,
    actor: Creature

  beforeEach(() => {
    game.currentMap = map = generateLevelMap()
    adjustMap = generateLevelMap()

    game.addMap(map.name, () => map)
    game.addMap(adjustMap.name, () => adjustMap)

    map.setTile(1, 1, new StairwayDown(map, adjustMap.name))
    adjustMap.setTile(1, 5, new StairwayUp(adjustMap, map.name))

    actor = generateCreatureWithAI(new Descender())
  })

  describe('when stairway is some tiles away', () => {
    beforeEach(() => {
      map.addCreature(new Point(3, 3), actor)
    })

    it('moves toward it', () => {
      actor.act(map, game)
      expect(map.creaturePos(actor).eq(new Point(2, 2))).toBeTruthy()
    })
  })

  describe('when stairway is a next tile', () => {
    beforeEach(() => {
      map.addCreature(new Point(2, 2), actor)
    })

    it('steps on it', () => {
      actor.act(map, game)
      expect(map.creaturePos(actor).eq(new Point(1, 1))).toBeTruthy()
    })
  })

  describe('when already stays on stairs', () => {
    beforeEach(() => {
      map.addCreature(new Point(1, 1), actor)
    })

    it('goes down', () => {
      actor.act(map, game)
      expect(() => map.creaturePos(actor)).toThrow()
      expect(adjustMap.creaturePos(actor).eq(new Point(1, 5))).toBeTruthy()
    })
  })
})
