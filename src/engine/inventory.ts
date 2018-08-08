import { Item, GroupedItem, ItemsBunch } from './items'
import { Creature } from './creature'
import { Usage } from './items/internal'

import { intersection } from 'lodash'

export abstract class InventorySlot {
  constructor(
    // What kind of items can be put in slot
    public readonly usages: Usage[],
    // Has to put only a single item or can put a bunch of them
    public readonly useSingleItem: boolean,
    public equipment?: GroupedItem
  ) {}

  public matchingItems(inventory: Inventory): GroupedItem[] {
    return inventory.cares().filter(itemGroup => this.match(itemGroup.item))
  }

  public removeItem(actor: Creature, count: number): void {
    if (this.equipment) {
      if (this.equipment.count === count) {
        this.equipment.item.onTakeOff(actor)
        this.equipment = undefined
      } else {
        this.equipment.count -= count
      }
    } else {
      // TODO: fail here
    }
  }

  public equip(actor: Creature, item: Item) {
    let inventory = actor.inventory,
      groupItem = inventory.findInBag(item)
    // TODO: assert item in a bag?
    // TODO: assert that can't equip more than have in inventory

    if (this.equipment) {
      inventory.putToBag(this.equipment.item, this.equipment.count)
      this.equipment.item.onTakeOff(actor)
    }

    const count = this.useSingleItem ? 1 : groupItem.count
    this.equipment = new GroupedItem(count, item)

    inventory.removeFromBag(item, count)
    item.onPutOn(actor)
  }

  public takeOff(actor: Creature): void {
    // TODO: Assert if nothing to remove?

    if (this.equipment) {
      actor.inventory.putToBag(this.equipment.item, this.equipment.count)
      this.equipment.item.onTakeOff(actor)
      this.equipment = null
    }
  }

  protected match(item: Item): boolean {
    return intersection(item.usages, this.usages).length > 0
  }
}

export class RightHandSlot extends InventorySlot {
  public name: string = 'Правая рука'
  constructor() {
    super([Usage.WeaponOneHand], true)
  }
}

export class LeftHandSlot extends InventorySlot {
  public name: string = 'Левая рука'
  constructor() {
    super([Usage.WeaponOneHand], true)
  }
}

export class BodySlot extends InventorySlot {
  public name: string = 'Корпус'
  constructor() {
    super([Usage.WearsOnBody], true)
  }
}

export class MissileWeaponSlot extends InventorySlot {
  public name: string = 'Метательное'
  constructor() {
    super([Usage.Shoot], true)
  }

  public matchingItems(inventory: Inventory): GroupedItem[] {
    let baseMatch = super.matchingItems(inventory),
      missile = inventory.missileSlot.equipment

    if (missile) {
      return baseMatch.filter(groupedItem => groupedItem.item.worksWith(missile.item))
    }

    return baseMatch
  }
}

export class MissileSlot extends InventorySlot {
  public name: string = 'Снаряды'
  constructor() {
    super([Usage.Throw], false)
  }

  public matchingItems(inventory: Inventory): GroupedItem[] {
    let baseMatch = super.matchingItems(inventory),
      missileWeapon = inventory.missileWeaponSlot.equipment

    if (missileWeapon) {
      return baseMatch.filter(groupedItem => groupedItem.item.worksWith(missileWeapon.item))
    }

    return baseMatch
  }
}

export class Inventory {
  private bag: ItemsBunch = new ItemsBunch()

  public rightHandSlot = new RightHandSlot()
  public leftHandSlot = new LeftHandSlot()
  public bodySlot = new BodySlot()
  public missileWeaponSlot = new MissileWeaponSlot()
  public missileSlot = new MissileSlot()

  // public inSlot(slot: InventorySlot): GroupedItem {
  //   const wearing = this.matchingEquip(slot)
  //   return wearing && wearing.equipment
  // }

  // public removeWearing(
  //   actor: Creature,
  //   slot: InventorySlot,
  //   count: number
  // ): void {
  //   let wearing = this.matchingEquip(slot)

  //   if (wearing && wearing.equipment) {
  //     if (wearing.equipment.count === count) {
  //       wearing.equipment.item.onTakeOff(actor)
  //       wearing.equipment = undefined
  //     } else {
  //       wearing.equipment.count -= count
  //     }
  //   } else {
  //     // TODO: fail here
  //   }
  // }

  public slots(): InventorySlot[] {
    return [
      this.rightHandSlot,
      this.leftHandSlot,
      this.bodySlot,
      this.missileWeaponSlot,
      this.missileSlot,
    ]
  }

  public cares(): GroupedItem[] {
    return this.bag.bunch
  }

  public canWear(item: Item) {
    return this.slots().some(
      wearing => intersection(item.usages, wearing.usages).length > 0
    )
  }

  // public matchingEquip(slot: InventorySlot): Wearing {
  //   return this.wearings.find(wearSlot => wearSlot.inventorySlot.id === slot.id)
  // }

  public findInBag(item: Item): GroupedItem {
    return this.bag.find(item)
  }

  public putToBag(item: Item, count: number): void {
    this.bag.put(item, count)
  }

  public removeFromBag(item: Item, count: number): void {
    this.bag.remove(item, count)
  }
}
