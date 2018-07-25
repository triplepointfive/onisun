import { Item } from './items'

import { Usage } from './items/internal'

import { remove, includes } from 'lodash'
import { Creature } from './creature'

export interface InventorySlot {
  id: number // TODO: OMG do something with it
  // What kind of items can be put in slot
  usage: Usage
  // Has to put only a single item or can put a bunch of them
  useSingleItem: boolean
}

export const RightHandSlot: InventorySlot = {
  id: 1,
  usage: Usage.WeaponOneHand,
  useSingleItem: true,
}
export const LeftHandSlot: InventorySlot = {
  id: 2,
  usage: Usage.WeaponOneHand,
  useSingleItem: true,
}
export const BodySlot: InventorySlot = {
  id: 3,
  usage: Usage.WearsOnBody,
  useSingleItem: true,
}
export const MissileSlot: InventorySlot = {
  id: 4,
  usage: Usage.Throw,
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

let inventoryItemId = 1
export class InventoryItem {
  public id: number

  constructor(public count: number, public item: Item) {
    this.id = inventoryItemId++
  }
}

export type Wearing = {
  bodyPart: InventorySlot
  equipment?: InventoryItem
}

export class Inventory {
  private wearings: Wearing[] = []
  private bag: InventoryItem[] = []

  constructor(parts: InventorySlot[]) {
    this.wearings = parts.map(bodyPart => {
      return { bodyPart: bodyPart }
    })
  }

  public inSlot(slot: InventorySlot): InventoryItem {
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

  public cares(): InventoryItem[] {
    return this.bag
  }

  public canWear(item: Item) {
    return this.wearings.some(wearing =>
      includes(item.usages, wearing.bodyPart.usage)
    )
  }

  public matchingEquip(slot: InventorySlot): Wearing {
    return this.wearings.find(wearSlot => wearSlot.bodyPart.id === slot.id)
  }

  public equip(actor: Creature, slot: InventorySlot, equipment: InventoryItem) {
    let wearing = this.matchingEquip(slot)

    if (wearing) {
      if (wearing.equipment) {
        this.putToBag(wearing.equipment)
        wearing.equipment.item.onTakeOff(actor)
      }

      // TODO: check how many items can put on
      wearing.equipment = equipment
      equipment.item.onPutOn(actor)
    } else {
      // TODO: fail here
    }
  }

  public takeOff(actor: Creature, invItem: InventoryItem) {
    this.wearings.forEach(wearing => {
      if (wearing.equipment && wearing.equipment.id === invItem.id) {
        this.putToBag(wearing.equipment)
        invItem.item.onTakeOff(actor)
        wearing.equipment = null
      }
    })
  }

  public putToBag(invItem: InventoryItem) {
    this.bag.push(invItem)
  }

  public removeFromBag(invItem: InventoryItem) {
    // TODO: Allow to remove only a part of items
    remove(this.bag, inventoryItem => inventoryItem.id === invItem.id)
  }
}
