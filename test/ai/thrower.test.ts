import {
  generateCreatureWithAI,
  generateCreature,
  generateLevelMap,
  generateMissile,
} from '../helpers'
import {
  Point,
  Thrower,
  Ability,
  InventoryItem,
  MissileSlot,
} from '../../src/engine'

let internalAI = new Thrower()
let actor, enemy, map

beforeEach(() => {
  actor = generateCreatureWithAI(internalAI)
  enemy = generateCreature()
  map = generateLevelMap()

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
    const invItem = new InventoryItem(1, generateMissile())
    actor.putOn(MissileSlot, invItem)

    enemy.addToMap(new Point(1, 4), map)

    actor.act(map)
  })

  it('Adds throwing effect', () => {
    const [nextActor, effect] = map.timeline.next()
    expect(nextActor).toBeFalsy()
    expect(effect).toBeTruthy()
  })

  it('Removes missile from inventory', () => {
    expect(actor.inventory.inSlot(Ability.Throwing)).toBeUndefined()
  })
})

describe('When there is someone else', () => {
  let enemy2

  beforeEach(() => {
    enemy2 = generateCreature()

    const invItem = new InventoryItem(1, generateMissile())
    actor.putOn(MissileSlot, invItem)

    internalAI.victim = enemy
  })

  it.only('Changes victim to the available one on a throw line', () => {
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
