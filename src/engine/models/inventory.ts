import {
  InventorySlot,
  RightHandSlot,
  LeftHandSlot,
  BodySlot,
  MissileWeaponSlot,
  MissileSlot,
  BootsSlot,
} from './inventory_slot'
import { Item } from './items'
import { ItemsBunch, GroupedItem } from '../lib/bunch'

export class Inventory {
  private bag: ItemsBunch<Item> = new ItemsBunch()

  public rightHandSlot = new RightHandSlot()
  public leftHandSlot = new LeftHandSlot()
  public bodySlot = new BodySlot()
  public missileWeaponSlot = new MissileWeaponSlot()
  public missileSlot = new MissileSlot()
  public bootsSlot = new BootsSlot()

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

  public cares(): GroupedItem<Item>[] {
    return this.bag.bunch
  }

  public findInBag(item: Item): GroupedItem<Item> | undefined {
    return this.bag.find(item)
  }

  public putToBag(item: Item, count: number): void {
    this.bag.put(item, count)
  }

  public removeFromBag(item: Item, count: number): void {
    this.bag.remove(item, count)
  }
}
