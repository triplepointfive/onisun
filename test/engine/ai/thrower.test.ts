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
  map = generateLevelMap()
  game = generateGame()
  map.game = game

  actor.addToMap(new Point(1, 1), map)
  actor.characteristics.dexterity.constantIncrease(10000)
})

describe('When there is nothing to throw', () => {
  it('Is not available', () => {
    expect(() => actor.act(map)).toThrow()
    expect(internalAI.available(actor)).toBeFalsy()
  })
})

describe('Throwing at enemy', () => {
  beforeEach(() => {
    const item = generateMissile()
    actor.inventory.putToBag(item, 1)
    actor.inventory.missileSlot.equip(actor, item)

    enemy.addToMap(new Point(1, 4), map)

    actor.act(map)
  })

  it('Adds throwing effect', () => {
    expect(game.effect).toBeTruthy()
  })

  it('Removes missile from inventory', () => {
    expect(actor.inventory.missileSlot.equipment).toBeUndefined()
  })
})

describe('When there is someone else', () => {
  let enemy2: Creature

  beforeEach(() => {
    enemy2 = generateCreature()

    const item = generateMissile()
    actor.inventory.putToBag(item, 1)
    actor.inventory.missileSlot.equip(actor, item)

    internalAI.victim = enemy
  })

  it('Changes victim to the available one on a throw line', () => {
    enemy2.addToMap(new Point(1, 3), map)
    enemy.addToMap(new Point(1, 4), map)

    actor.act(map)

    expect(internalAI.victim.id).toEqual(enemy2.id)
  })

  it('Attacks the same victim if possible', () => {
    enemy.addToMap(new Point(1, 3), map)
    enemy2.addToMap(new Point(3, 1), map)

    actor.act(map)

    expect(internalAI.victim.id).toEqual(enemy.id)
  })

  it("Changes target when can't see victim anymore", () => {
    enemy2.addToMap(new Point(3, 1), map)
    enemy.addToMap(new Point(1, 7), map)

    actor.act(map)

    expect(internalAI.victim.id).toEqual(enemy2.id)
  })
})