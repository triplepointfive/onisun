import { Inventory, RightHandSlot, BodySlot } from '../src/inventory'
import {
  generateOneHandedWeapon,
  generateCreature,
  generateBodyArmor,
} from './helpers'
import { Creature, Item, GroupedItem } from '../src/engine'

let item1: Item = generateOneHandedWeapon()
let item2: Item = generateOneHandedWeapon()
const creature: Creature = generateCreature()

describe('puts on and takes off', () => {
  let inventory: Inventory

  beforeEach(() => {
    inventory = new Inventory([RightHandSlot])
  })

  it('empty slot', () => {
    inventory.putToBag(item1, 1)
    inventory.equip(creature, RightHandSlot, item1)
    expect(inventory.wears()[0].equipment.item).toEqual(item1)
    inventory.takeOff(creature, RightHandSlot)
    expect(inventory.wears()[0].equipment).toBeNull()
    expect(inventory.cares().length).toEqual(1)
    expect(inventory.cares()[0].item).toEqual(item1)
  })

  it('already taken slot', () => {
    inventory.putToBag(item1, 1)
    inventory.putToBag(item2, 1)
    inventory.equip(creature, RightHandSlot, item1)
    inventory.equip(creature, RightHandSlot, item2)

    expect(inventory.wears()[0].equipment.item).toBe(item2)
    expect(inventory.cares().length).toEqual(1)
    expect(inventory.cares()[0].item).toEqual(item1)

    inventory.takeOff(creature, RightHandSlot)
    expect(inventory.wears()[0].equipment).toBeNull()
    expect(inventory.cares().length).toEqual(2)
    expect(inventory.cares()[0].item).toEqual(item1)
    expect(inventory.cares()[1].item).toEqual(item2)
  })

  it('checks what is put in a slot', () => {
    expect(inventory.inSlot(RightHandSlot)).toBeUndefined()

    inventory.putToBag(item1, 1)
    inventory.equip(creature, RightHandSlot, item1)
    expect(inventory.wears()[0].equipment.item).toBe(item1)

    expect(inventory.inSlot(RightHandSlot).item).toEqual(item1)
  })

  it('checks if can put an item on', () => {
    expect(inventory.canWear(item1)).toBeTruthy()

    const bodyArmor = generateBodyArmor()

    expect(inventory.canWear(bodyArmor)).toBeFalsy()
  })
})

describe('failed', () => {
  let inventory: Inventory

  beforeEach(() => {
    inventory = new Inventory([BodySlot])
  })

  it('can not wear if there is no matching slot', () => {
    inventory.putToBag(item1, 1)
    inventory.equip(creature, RightHandSlot, item1)
    expect(inventory.wears()[0].equipment).toBeFalsy()
    expect(inventory.cares().length).toEqual(1)
  })

  it('drops item', () => {
    inventory.putToBag(item1, 1)
    expect(inventory.cares().length).toEqual(1)
    expect(inventory.cares()[0].item).toEqual(item1)
    inventory.removeFromBag(item1, 1)
    expect(inventory.cares()).toEqual([])
  })

  it('removes item that is not in inventory', () => {
    expect(inventory.cares()).toEqual([])
    inventory.removeFromBag(item1, 1)
    expect(inventory.cares()).toEqual([])
  })

  it('takes off the item that is not put on yet', () => {
    expect(inventory.wears()[0].equipment).toBeFalsy()
    inventory.takeOff(creature, BodySlot)
    expect(inventory.wears()[0].equipment).toBeFalsy()
  })
})
