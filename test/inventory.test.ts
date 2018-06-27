import { Inventory, BodyPart } from '../src/inventory'
import { generateOneHandedWeapon, generateCreature } from './helpers'

let item1 = generateOneHandedWeapon()
let item2 = generateOneHandedWeapon()
const creature = generateCreature()

describe('puts on and takes off', () => {
  let inventory: Inventory

  beforeEach(() => {
    inventory = new Inventory([BodyPart.RightHand])
  })

  it('empty slot', () => {
    inventory.equip(creature, item1)
    expect(inventory.wears()[0].equipment).toBe(item1)
    inventory.takeOff(creature, item1)
    expect(inventory.wears()[0].equipment).toBeNull()
    expect(inventory.cares()).toEqual([item1])
  })

  it('already taken slot', () => {
    inventory.equip(creature, item1)
    inventory.equip(creature, item2)
    expect(inventory.wears()[0].equipment).toBe(item2)
    expect(inventory.cares()).toEqual([item1])
    inventory.takeOff(creature, item2)
    expect(inventory.wears()[0].equipment).toBeNull()
    expect(inventory.cares()).toEqual([item1, item2])
  })
})

describe('failed', () => {
  let inventory: Inventory

  beforeEach(() => {
    inventory = new Inventory([BodyPart.Head])
  })

  it('can not wear if there is no matching slot', () => {
    inventory.equip(creature, item1)
    expect(inventory.wears()[0].equipment).toBeFalsy()
    expect(inventory.cares()).toEqual([])
  })

  it('drops item', () => {
    inventory.putToBag(item1)
    expect(inventory.cares()).toEqual([item1])
    inventory.removeFromBag(item1)
    expect(inventory.cares()).toEqual([])
  })

  it('removes item that is not in inventory', () => {
    expect(inventory.cares()).toEqual([])
    inventory.removeFromBag(item1)
    expect(inventory.cares()).toEqual([])
  })

  it('takes off the item that is not put on yet', () => {
    expect(inventory.wears()[0].equipment).toBeFalsy()
    inventory.takeOff(creature, item2)
    expect(inventory.wears()[0].equipment).toBeFalsy()
  })
})
