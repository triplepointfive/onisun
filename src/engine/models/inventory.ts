import {
  InventorySlot,
  RightHandSlot,
  LeftHandSlot,
  BodySlot,
  MissileWeaponSlot,
  MissileSlot,
  BootsSlot,
} from './inventory_slot'
import { ItemsBunch, GroupedItem, Item } from './items'

export class Inventory {
  private bag: ItemsBunch = new ItemsBunch()

  public rightHandSlot = new RightHandSlot()
  public leftHandSlot = new LeftHandSlot()
  public bodySlot = new BodySlot()
  public missileWeaponSlot = new MissileWeaponSlot()
  public missileSlot = new MissileSlot()
  public bootsSlot = new BootsSlot()

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
      this.bootsSlot,
      this.missileWeaponSlot,
      this.missileSlot,
    ]
  }

  public cares(): GroupedItem[] {
    return this.bag.bunch
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
