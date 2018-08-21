import {
  generateCreatureWithAI,
  generateLevelMap,
  generateItem,
  generateGame,
} from '../helpers'
import { Picker, Point } from '../../../src/engine'

let internalAI = new Picker()
let creature = generateCreatureWithAI(internalAI)
const map = generateLevelMap(),
  game = generateGame()

beforeEach(() => {
  creature.addToMap(new Point(1, 1), map)
  map.game = game
})

describe('When there are no items', () => {
  it('Not available', () => {
    expect(creature.ai.available(creature)).toBeFalsy()
  })
})

describe('When there is only one item', () => {
  beforeEach(() => {
    map.at(3, 3).addItem(generateItem(), 1)
    creature.act(map, game)
  })

  it('AI is available', () => {
    expect(internalAI.available(creature)).toBeTruthy()
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

  it('AI is available', () => {
    expect(internalAI.available(creature)).toBeTruthy()
  })

  it("Destination is set to the closest item's position", () => {
    expect(internalAI.destination).toBeTruthy()
    expect(internalAI.destination.eq(new Point(3, 3))).toBeTruthy()
  })
})

describe('When an item is on an adjacent cell', () => {
  // TODO
})

describe('When an item is on the same cell as a player', () => {
  // TODO
})

describe('When items on every single cell around', () => {
  beforeEach(() => {
    map.at(1, 2).addItem(generateItem(), 1)
    map.at(2, 2).addItem(generateItem(), 1)
    map.at(2, 1).addItem(generateItem(), 1)
  })

  it('AI is available', () => {
    expect(creature.ai.available(creature)).toBeTruthy()
  })

  it('Moves to adjacent cell', () => {
    creature.act(map, game)
    expect(creature.pos.x === 2 || creature.pos.y === 2).toBeTruthy()
  })
})
