import { Item, Equipment } from './items'

import { Usage } from './items/internal'

import { remove, includes } from 'lodash'
import { Creature } from './creature'

export enum BodyPart {
  LeftHand,
  RightHand,
  Legs,
  Finger,
  Head,
  Eye,
  Neck,
  Back,
  Body,

  MissileWeapon,
  Missile,
}

export type Wearing = {
  bodyPart: BodyPart
  equipment?: Equipment
}

const bodyToUsage = {
  [BodyPart.RightHand]: Usage.WeaponOneHand,
  [BodyPart.Body]: Usage.WearsOnBody,
  [BodyPart.Missile]: Usage.Throw,
}

export class Inventory {
  private wearings: Wearing[] = []
  private bag: Item[] = []

  constructor(parts: BodyPart[]) {
    this.wearings = parts.map(bodyPart => {
      return { bodyPart: bodyPart }
    })
  }

  public inSlot(usage: Usage): Equipment[] {
    const match = this.wears().find(
      ({ bodyPart }) => usage === bodyToUsage[bodyPart]
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
      includes(item.usages, bodyToUsage[wearing.bodyPart])
    )
  }

  public matchingEquip(item: Equipment): Wearing[] {
    return this.wearings.filter(wearing =>
      includes(item.usages, bodyToUsage[wearing.bodyPart])
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
