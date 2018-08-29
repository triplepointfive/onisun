import {
  generateCreatureWithAI,
  generateCreature,
  generateLevelMap,
  generateGame,
} from '../helpers'
import {
  Point,
  LevelMap,
  Attacker,
  Game,
  AttackEvent,
} from '../../../src/engine'

let internalAI = new Attacker(),
  actor = generateCreatureWithAI(internalAI),
  enemy = generateCreature(),
  map: LevelMap,
  game: Game

beforeEach(() => {
  game = generateGame()
  game.currentMap = map = generateLevelMap()

  map.addCreature(new Point(1, 1), actor)

  actor.characteristics.dexterity.constantIncrease(10000)
})

describe('When there are no enemies', () => {
  it('Is not available', () => {
    expect(actor.act(map, game)).toBeFalsy()
  })
})

describe('When enemy is too far away', () => {
  beforeEach(() => {
    map.addCreature(new Point(3, 3), enemy)
    expect(actor.act(map, game)).toBeFalsy()
  })

  it('Is not available', () => {
    expect(actor.act(map, game)).toBeFalsy()
  })
})

describe('When enemy is close enough', () => {
  beforeEach(() => {
    map.addCreature(new Point(2, 2), enemy)
    actor.on = jest.fn()
    actor.act(map, game)
  })

  it('Builds command', () => {
    expect(actor.on.mock.calls.length).toEqual(2)
    expect(actor.on.mock.calls[0][0]).toBeInstanceOf(AttackEvent)
  })
})
