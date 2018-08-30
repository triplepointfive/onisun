import { Inventory, Item } from '../../../src/engine'
import { generateOneHandedWeapon } from '../helpers'

let item1: Item = generateOneHandedWeapon()

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
})
