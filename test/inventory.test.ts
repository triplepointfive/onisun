import { Inventory, BodyPart } from '../src/inventory'
import { generateOneHandedWeapon } from './helpers'

let item1 = generateOneHandedWeapon()
let item2 = generateOneHandedWeapon()

describe('puts on and takes off', () => {
  let inventory: Inventory

  beforeEach(() => {
    inventory = new Inventory([BodyPart.RightHand])
  })

  test('empty slot', () => {
    inventory.equip(item1)
    expect(inventory.wears()[0].equipment).toBe(item1)
    inventory.takeOff(item1)
    expect(inventory.wears()[0].equipment).toBeNull
    expect(inventory.cares()).toEqual([item1])
  })

  test('already taken slot', () => {
    inventory.equip(item1)
    inventory.equip(item2)
    expect(inventory.wears()[0].equipment).toBe(item2)
    expect(inventory.cares()).toEqual([item1])
    inventory.takeOff(item2)
    expect(inventory.wears()[0].equipment).toBeNull
    expect(inventory.cares()).toEqual([item1, item2])
  })
})

describe('failed', () => {
  let inventory: Inventory

  beforeEach(() => {
    inventory = new Inventory([BodyPart.Head])
  })

  test('can not wear if there is no matching slot', () => {
    inventory.equip(item1)
    expect(inventory.wears()[0].equipment).toBeNull
    expect(inventory.cares()).toEqual([])
  })

  test('drops item', () => {
    inventory.putToBag(item1)
    expect(inventory.cares()).toEqual([item1])
    inventory.removeFromBag(item1)
    expect(inventory.cares()).toEqual([])
  })

  test('removes item that is not in inventory', () => {
    expect(inventory.cares()).toEqual([])
    inventory.removeFromBag(item1)
    expect(inventory.cares()).toEqual([])
  })

  test('takes off the item that is not put on yet', () => {
    expect(inventory.wears()[0].equipment).toBeNull
    inventory.takeOff(item2)
    expect(inventory.wears()[0].equipment).toBeNull
  })
})
