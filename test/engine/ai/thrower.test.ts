import {
  generateCreatureWithAI,
  generateCreature,
  generateLevelMap,
  generateMissile,
  generateGame,
} from '../helpers'
import { Point, Thrower, Creature, LevelMap } from '../../../src/engine'

let internalAI = new Thrower()
let actor: Creature, enemy: Creature, map: LevelMap, game

beforeEach(() => {
  actor = generateCreatureWithAI(internalAI)
  enemy = generateCreature()
  game = generateGame()
  game.currentMap = map = generateLevelMap()

  map.addCreature(new Point(1, 1), actor)
  actor.characteristics.dexterity.constantIncrease(10000)
})

describe('When there is nothing to throw', () => {
  it('Is not available', () => {
    expect(actor.act(map, game)).toBeFalsy()
  })
})

describe('Throwing at enemy', () => {
  beforeEach(() => {
    actor.specie.throwingItem = generateMissile()

    map.addCreature(new Point(1, 4), enemy)

    actor.act(map, game)
  })

  it('Adds throwing effect', () => {
    expect(game.effect).toBeTruthy()
  })
})

describe('When there is someone else', () => {
  let enemy2: Creature

  beforeEach(() => {
    enemy2 = generateCreature()
    enemy2.specie.throwingItem = generateMissile()

    internalAI.victim = enemy
  })

  it('Changes victim to the available one on a throw line', () => {
    map.addCreature(new Point(1, 4), enemy)
    map.addCreature(new Point(1, 3), enemy2)

    actor.act(map, game)

    expect(internalAI.victim.id).toEqual(enemy2.id)
  })

  it('Attacks the same victim if possible', () => {
    map.addCreature(new Point(1, 3), enemy)
    map.addCreature(new Point(3, 1), enemy2)

    actor.act(map, game)

    expect(internalAI.victim.id).toEqual(enemy.id)
  })

  it("Changes target when can't see victim anymore", () => {
    map.addCreature(new Point(1, 7), enemy)
    map.addCreature(new Point(3, 1), enemy2)

    actor.act(map, game)

    expect(internalAI.victim.id).toEqual(enemy2.id)
  })
})
