import {
  Inventory,
  RightHandSlot,
  BodySlot,
  InventoryItem,
} from '../src/inventory'
import {
  generateOneHandedWeapon,
  generateCreature,
  generateBodyArmor,
} from './helpers'

let item1 = generateOneHandedWeapon()
let item2 = generateOneHandedWeapon()
const creature = generateCreature()

describe('puts on and takes off', () => {
  let inventory: Inventory

  beforeEach(() => {
    inventory = new Inventory([RightHandSlot])
  })

  it('empty slot', () => {
    const invItem = new InventoryItem(1, item1)
    inventory.equip(creature, RightHandSlot, invItem)
    expect(inventory.wears()[0].equipment.item).toEqual(item1)
    inventory.takeOff(creature, invItem)
    expect(inventory.wears()[0].equipment).toBeNull()
    expect(inventory.cares().length).toEqual(1)
    expect(inventory.cares()[0].item).toEqual(item1)
  })

  it('already taken slot', () => {
    inventory.equip(creature, RightHandSlot, new InventoryItem(1, item1))

    const invItem = new InventoryItem(1, item2)
    inventory.equip(creature, RightHandSlot, invItem)
    expect(inventory.wears()[0].equipment.item).toBe(item2)
    expect(inventory.cares().length).toEqual(1)
    expect(inventory.cares()[0].item).toEqual(item1)

    inventory.takeOff(creature, invItem)
    expect(inventory.wears()[0].equipment).toBeNull()
    expect(inventory.cares().length).toEqual(2)
    expect(inventory.cares()[0].item).toEqual(item1)
    expect(inventory.cares()[1].item).toEqual(item2)
  })

  it('checks what is put in a slot', () => {
    expect(inventory.inSlot(RightHandSlot)).toBeUndefined()

    const invItem = new InventoryItem(1, item1)
    inventory.equip(creature, RightHandSlot, invItem)
    expect(inventory.wears()[0].equipment.item).toBe(item1)

    expect(inventory.inSlot(RightHandSlot)).toEqual(invItem)
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
    inventory.equip(creature, RightHandSlot, new InventoryItem(1, item1))
    expect(inventory.wears()[0].equipment).toBeFalsy()
    expect(inventory.cares()).toEqual([])
  })

  it('drops item', () => {
    const invItem = new InventoryItem(1, item1)
    inventory.putToBag(invItem)
    expect(inventory.cares().length).toEqual(1)
    expect(inventory.cares()[0].item).toEqual(item1)
    inventory.removeFromBag(invItem)
    expect(inventory.cares()).toEqual([])
  })

  it('removes item that is not in inventory', () => {
    expect(inventory.cares()).toEqual([])
    inventory.removeFromBag(new InventoryItem(1, item1))
    expect(inventory.cares()).toEqual([])
  })

  it('takes off the item that is not put on yet', () => {
    expect(inventory.wears()[0].equipment).toBeFalsy()
    inventory.takeOff(creature, item2)
    expect(inventory.wears()[0].equipment).toBeFalsy()
  })
})
