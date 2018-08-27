import {
  generateCreatureWithAI,
  generateCreature,
  generateLevelMap,
  generateGame,
} from '../helpers'
import { Point, LevelMap, Attacker, Game } from '../../../src/engine'

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
    expect(() => actor.act(map, game)).toThrow()
    expect(internalAI.available(actor, game)).toBeFalsy()
  })
})

describe('When enemy is too far away', () => {
  beforeEach(() => {
    map.addCreature(new Point(3, 3), enemy)
    expect(() => actor.act(map, game)).toThrow()
  })

  it('Is not available', () => {
    expect(internalAI.available(actor, game)).toBeFalsy()
  })
})

describe('When enemy is close enough', () => {
  beforeEach(() => {
    map.addCreature(new Point(2, 2), enemy)
    actor.act(map, game)
  })

  it('Is available', () => {
    expect(internalAI.available(actor, game)).toBeTruthy()
  })

  it('Victim is set', () => {
    expect(internalAI.victim).toBeTruthy()
  })

  it('Resets victim on their death', () => {
    enemy.characteristics.health.decrease(50)
    actor.act(map, game)
    expect(internalAI.victim).toBeUndefined()
  })
})
