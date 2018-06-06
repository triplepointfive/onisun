import { Item, Equipment } from './items'

import { remove } from 'lodash'

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
}

type Wearing = {
  bodyPart: BodyPart
  equipment?: Equipment
}

export class Inventory {
  private wearings: Wearing[] = []
  private bag: Item[] = []

  constructor(parts: BodyPart[]) {
    this.wearings = parts.map(bodyPart => { return { bodyPart: bodyPart } })
  }

  public wears(): Wearing[] {
    return this.wearings
  }

  public cares(): Item[] {
    return this.bag
  }

  public equip(item: Equipment) {
    this.wearings.forEach(wearing => {
      if (wearing.bodyPart === item.bodyPart()) {
        if (wearing.equipment) {
          this.putToBag(wearing.equipment)
        }

        return wearing.equipment = item
      }
    })
  }

  public takeOff(item: Equipment) {
    this.wearings.forEach(wearing => {
      if (wearing.equipment && wearing.equipment.id === item.id) {
        this.putToBag(wearing.equipment)
        return wearing.equipment = null
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
