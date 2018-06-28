import {
  generateCreatureWithAI,
  generateCreature,
  generateLevel,
  generateMissile,
} from '../helpers'
import { Point, Thrower, Ability } from '../../src/engine'

let internalAI = new Thrower()
let actor, enemy, map

beforeEach(() => {
  actor = generateCreatureWithAI(internalAI)
  enemy = generateCreature()
  map = generateLevel()

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
    actor.putOn(generateMissile())
    enemy.addToMap(new Point(1, 4), map)
  })

  it('Kills enemy with low health', () => {
    enemy.characteristics.health.decrease(enemy.characteristics.health.currentValue() - 1)
    actor.act(map)

    expect(map.at(enemy.pos.x, enemy.pos.y).creature).toBeFalsy()
  })

  it('Removes missile from inventory', () => {
    actor.act(map)

    expect(actor.inventory.inSlot(Ability.Throwing)).toEqual([])
    expect(enemy.characteristics.health.atMax()).toBeFalsy()
  })
})

describe('When there is someone else', () => {
  let enemy2

  beforeEach(() => {
    enemy2 = generateCreature()

    actor.putOn(generateMissile())

    internalAI.victim = enemy
  })

  it.skip('Changes victim to the available one on a throw line', () => {
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
