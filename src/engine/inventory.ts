import { Item, GroupedItem, ItemsBunch } from './items'

import { Usage } from './items/internal'

import { intersection } from 'lodash'
import { Creature } from './creature'

export interface InventorySlot {
  id: number // TODO: OMG do something with it
  // What kind of items can be put in slot
  usages: Usage[]
  // Has to put only a single item or can put a bunch of them
  useSingleItem: boolean
}

export const RightHandSlot: InventorySlot = {
  id: 1,
  usages: [Usage.WeaponOneHand],
  useSingleItem: true,
}
export const LeftHandSlot: InventorySlot = {
  id: 2,
  usages: [Usage.WeaponOneHand],
  useSingleItem: true,
}
export const BodySlot: InventorySlot = {
  id: 3,
  usages: [Usage.WearsOnBody],
  useSingleItem: true,
}
export const MissileSlot: InventorySlot = {
  id: 4,
  usages: [Usage.Throw],
  useSingleItem: false,
}

export const allInventorySlots = [
  RightHandSlot,
  LeftHandSlot,
  BodySlot,
  MissileSlot,
]
// LeftHand,
// Legs,
// Finger,
// Head,
// Eye,
// Neck,
// Back,

// MissileWeapon,

export type Wearing = {
  inventorySlot: InventorySlot
  equipment?: GroupedItem
}

export class Inventory {
  private wearings: Wearing[] = []
  private bag: ItemsBunch = new ItemsBunch()

  constructor(parts: InventorySlot[]) {
    this.wearings = parts.map(inventorySlot => {
      return { inventorySlot: inventorySlot }
    })
  }

  public inSlot(slot: InventorySlot): GroupedItem {
    const wearing = this.matchingEquip(slot)
    return wearing && wearing.equipment
  }

  public removeWearing(
    actor: Creature,
    slot: InventorySlot,
    count: number
  ): void {
    let wearing = this.matchingEquip(slot)

    if (wearing && wearing.equipment) {
      if (wearing.equipment.count === count) {
        wearing.equipment.item.onTakeOff(actor)
        wearing.equipment = undefined
      } else {
        wearing.equipment.count -= count
      }
    } else {
      // TODO: fail here
    }
  }

  public wears(): Wearing[] {
    return this.wearings
  }

  public cares(): GroupedItem[] {
    return this.bag.bunch
  }

  public canWear(item: Item) {
    return this.wearings.some(wearing =>
      intersection(item.usages, wearing.inventorySlot.usages).length > 0
    )
  }

  public matchingEquip(slot: InventorySlot): Wearing {
    return this.wearings.find(wearSlot => wearSlot.inventorySlot.id === slot.id)
  }

  public equip(actor: Creature, slot: InventorySlot, item: Item) {
    let wearing = this.matchingEquip(slot),
      groupItem = this.bag.find(item)

    if (wearing && groupItem) {
      if (wearing.equipment) {
        this.putToBag(wearing.equipment.item, wearing.equipment.count)
        wearing.equipment.item.onTakeOff(actor)
      }

      // TODO: Check that can't equip more than have in inventory

      const count = slot.useSingleItem ? 1 : groupItem.count
      wearing.equipment = new GroupedItem(count, item)

      this.bag.remove(item, count)
      item.onPutOn(actor)
    } else {
      // TODO: fail here
    }
  }

  public takeOff(actor: Creature, slot: InventorySlot): void {
    const wearing = this.wearings.find(
      wearing => wearing.inventorySlot === slot
    )

    if (wearing && wearing.equipment) {
      this.putToBag(wearing.equipment.item, wearing.equipment.count)
      wearing.equipment.item.onTakeOff(actor)
      wearing.equipment = null
    }

    // TODO: Fail if nothing to remove?
  }

  public putToBag(item: Item, count: number): void {
    this.bag.put(item, count)
  }

  public removeFromBag(item: Item, count: number): void {
    this.bag.remove(item, count)
  }
}
