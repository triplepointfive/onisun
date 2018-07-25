import { Item, Equipment } from './items'

import { Usage } from './items/internal'

import { remove, includes } from 'lodash'
import { Creature } from './creature'

export interface InventorySlot {
  // What kind of items can be put in slot
  usage: Usage
  // Has to put only a single item or can put a bunch of them
  useSingleItem: boolean
}

export const RightHandSlot: InventorySlot = { usage: Usage.WeaponOneHand, useSingleItem: true  }
export const LeftHandSlot:  InventorySlot = { usage: Usage.WeaponOneHand, useSingleItem: true  }
export const BodySlot:      InventorySlot = { usage: Usage.WearsOnBody,   useSingleItem: true  }
export const MissileSlot:   InventorySlot = { usage: Usage.Throw,         useSingleItem: false }
  // LeftHand,
  // Legs,
  // Finger,
  // Head,
  // Eye,
  // Neck,
  // Back,

  // MissileWeapon,

export type Wearing = {
  bodyPart: InventorySlot
  equipment?: Equipment
}

export class Inventory {
  private wearings: Wearing[] = []
  private bag: Item[] = []

  constructor(parts: InventorySlot[]) {
    this.wearings = parts.map(bodyPart => {
      return { bodyPart: bodyPart }
    })
  }

  public inSlot(usage: Usage): Equipment[] {
    const match = this.wears().find(
      ({ bodyPart }) => usage === bodyPart.usage
    )
    return match && match.equipment ? [match.equipment] : []
  }

  public wears(): Wearing[] {
    return this.wearings
  }

  public cares(): Item[] {
    return this.bag
  }

  public canWear(item: Equipment) {
    return this.wearings.some(wearing =>
      includes(item.usages, wearing.bodyPart.usage)
    )
  }

  public matchingEquip(item: Equipment): Wearing[] {
    return this.wearings.filter(wearing =>
      includes(item.usages, wearing.bodyPart.usage)
    )
  }

  public equip(actor: Creature, item: Equipment) {
    this.matchingEquip(item).forEach(wearing => {
      if (wearing.equipment) {
        this.putToBag(wearing.equipment)
        wearing.equipment.onTakeOff(actor)
      }

      wearing.equipment = item
      item.onPutOn(actor)
    })
  }

  public takeOff(actor: Creature, item: Equipment) {
    this.wearings.forEach(wearing => {
      if (wearing.equipment && wearing.equipment.id === item.id) {
        this.putToBag(wearing.equipment)
        item.onTakeOff(actor)
        wearing.equipment = null
      }
    })
  }

  public putToBag(item: Item) {
    this.bag.push(item)
  }

  public removeFromBag(item: Item) {
    remove(this.bag, inventoryItem => inventoryItem.id === item.id)
  }
}
