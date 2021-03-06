import {
  generateCreatureWithAI,
  generateLevelMap,
  generateItem,
  generateGame,
} from '../helpers'
import {
  Picker,
  Point,
  MoveEvent,
  LevelMap,
  PickUpItemsEvent,
} from '../../../src/engine'

describe('Picker', () => {
  let internalAI = new Picker(),
    creature = generateCreatureWithAI(internalAI),
    map: LevelMap
  const game = generateGame()

  beforeEach(() => {
    game.currentMap = map = generateLevelMap()
    map.addCreature(new Point(1, 1), creature)

    creature.on = jest.fn()
  })

  describe('When there are no items', () => {
    it('Not available', () => {
      creature.act(map, game)
      expect(creature.on.mock.calls.length).toEqual(1)
    })
  })

  describe('When there is only one item', () => {
    beforeEach(() => {
      map.at(3, 3).addItem(generateItem(), 1)
      creature.act(map, game)
    })

    it('Got move command', () => {
      expect(creature.on.mock.calls.length).toEqual(2)
      expect(creature.on.mock.calls[0][0]).toBeInstanceOf(MoveEvent)
    })

    it('Destination is set to item position', () => {
      expect(internalAI.destination).toBeTruthy()
      expect(internalAI.destination.eq(new Point(3, 3))).toBeTruthy()
    })
  })

  describe('When there are multiple items', () => {
    beforeEach(() => {
      map.at(3, 3).addItem(generateItem(), 1)
      map.at(3, 5).addItem(generateItem(), 1)
      creature.act(map, game)
    })

    it("Destination is set to the closest item's position", () => {
      expect(internalAI.destination).toBeTruthy()
      expect(internalAI.destination.eq(new Point(3, 3))).toBeTruthy()
    })
  })

  describe('When an item is on the same cell as a player', () => {
    beforeEach(() => {
      map.at(1, 1).addItem(generateItem(), 1)
      creature.act(map, game)
    })

    it('Got pick up command', () => {
      expect(creature.on.mock.calls.length).toEqual(2)
      expect(creature.on.mock.calls[0][0]).toBeInstanceOf(PickUpItemsEvent)
    })
  })

  describe('When items on every single cell around', () => {
    beforeEach(() => {
      map.at(1, 2).addItem(generateItem(), 1)
      map.at(2, 2).addItem(generateItem(), 1)
      map.at(2, 1).addItem(generateItem(), 1)
      creature.act(map, game)
    })

    it('Got move command', () => {
      expect(creature.on.mock.calls.length).toEqual(2)
      expect(creature.on.mock.calls[0][0]).toBeInstanceOf(MoveEvent)
    })
  })
})
