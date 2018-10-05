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
  Power,
  KnockWeaponOutEvent,
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
  })

  it('Builds command', () => {
    actor.act(map, game)
    expect(actor.on.mock.calls.length).toEqual(2)
    expect(actor.on.mock.calls[0][0]).toBeInstanceOf(AttackEvent)
  })

  it('Knocks weapons out if possible', () => {
    enemy.canBeDisarmed = jest.fn(() => true)
    actor.specie.powers.push(Power.KnockWeaponOut)

    actor.act(map, game)
    expect(actor.on.mock.calls.length).toEqual(2)
    expect(actor.on.mock.calls[0][0]).toBeInstanceOf(KnockWeaponOutEvent)
  })
})
