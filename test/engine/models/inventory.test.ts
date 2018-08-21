import { Inventory, RightHandSlot, BodySlot } from '../../../src/engine'
import {
  generateOneHandedWeapon,
  generateCreature,
  generateBodyArmor,
} from '../helpers'
import { Creature, Item, GroupedItem } from '../../../src/engine'

let item1: Item = generateOneHandedWeapon()
let item2: Item = generateOneHandedWeapon()
const creature: Creature = generateCreature()

describe('puts on and takes off', () => {
  let inventory: Inventory

  beforeEach(() => {
    inventory = new Inventory()
  })

  it('empty slot', () => {
    inventory.putToBag(item1, 1)
    inventory.rightHandSlot.equip(creature, item1)
    expect(inventory.slots()[0].equipment.item).toEqual(item1)
    inventory.rightHandSlot.takeOff(creature)
    expect(inventory.slots()[0].equipment).toBeNull()
    expect(inventory.cares().length).toEqual(1)
    expect(inventory.cares()[0].item).toEqual(item1)
  })

  it('checks what is put in a slot', () => {
    expect(inventory.rightHandSlot.equipment).toBeUndefined()

    inventory.putToBag(item1, 1)
    inventory.rightHandSlot.equip(creature, item1)

    expect(inventory.rightHandSlot.equipment.item).toEqual(item1)
  })
})

describe('failed', () => {
  let inventory: Inventory

  beforeEach(() => {
    inventory = new Inventory()
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
    expect(inventory.rightHandSlot.equipment).toBeUndefined()
    expect(() => inventory.rightHandSlot.takeOff(creature)).toThrowError()
  })
})
