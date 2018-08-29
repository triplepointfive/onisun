import {
  InventorySlot,
  RightHandSlot,
  LeftHandSlot,
  ChestSlot,
  MissileWeaponSlot,
  MissileSlot,
  BootsSlot,
  HeadSlot,
  AmuletSlot,
  LeftFingerSlot,
  RightFingerSlot,
  GlovesSlot,
  GauntletsSlot,
  BeltSlot,
  ToolsSlot,
  CloakSlot,
} from './inventory_slot'
import { Item } from './items'
import { ItemsBunch, GroupedItem } from '../lib/bunch'

export class Inventory {
  private bag: ItemsBunch<Item> = new ItemsBunch()

  public headSlot = new HeadSlot()
  public amuletSlot = new AmuletSlot()
  public cloakSlot = new CloakSlot()
  public chestSlot = new ChestSlot()
  public rightHandSlot = new RightHandSlot()
  public leftHandSlot = new LeftHandSlot()
  public leftFingerSlot = new LeftFingerSlot()
  public rightFingerSlot = new RightFingerSlot()
  public glovesSlot = new GlovesSlot()
  public gauntletsSlot = new GauntletsSlot()
  public beltSlot = new BeltSlot()
  public bootsSlot = new BootsSlot()
  public missileWeaponSlot = new MissileWeaponSlot()
  public missileSlot = new MissileSlot()
  public toolsSlot = new ToolsSlot()

  public slots(): InventorySlot[] {
    return [
      this.headSlot,
      this.amuletSlot,
      this.cloakSlot,
      this.chestSlot,
      this.rightHandSlot,
      this.leftHandSlot,
      this.leftFingerSlot,
      this.rightFingerSlot,
      this.glovesSlot,
      this.gauntletsSlot,
      this.beltSlot,
      this.bootsSlot,
      this.missileWeaponSlot,
      this.missileSlot,
      this.toolsSlot,
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
