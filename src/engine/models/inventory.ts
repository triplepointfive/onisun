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
  BodyPart,
} from './inventory_slot'
import { Item } from './item'
import { ItemsBunch, GroupedItem } from '../lib/bunch'
import { concat, compact } from 'lodash'
import { Material } from '../lib/material'

export class Inventory {
  private bag: ItemsBunch<Item> = new ItemsBunch()

  public headSlot = new HeadSlot(Material.flesh)
  public amuletSlot = new AmuletSlot()
  public cloakSlot = new CloakSlot()
  public chestSlot = new ChestSlot(Material.paper)
  public rightHandSlot = new RightHandSlot(Material.flesh)
  public leftHandSlot = new LeftHandSlot(Material.flesh)
  public leftFingerSlot = new LeftFingerSlot()
  public rightFingerSlot = new RightFingerSlot()
  public glovesSlot = new GlovesSlot()
  public gauntletsSlot = new GauntletsSlot()
  public beltSlot = new BeltSlot()
  public bootsSlot = new BootsSlot(Material.flesh)
  public missileWeaponSlot = new MissileWeaponSlot()
  public missileSlot = new MissileSlot()
  public toolsSlot = new ToolsSlot()

  get bodyParts(): BodyPart[] {
    return [
      this.headSlot,
      this.rightHandSlot,
      this.leftHandSlot,
      this.chestSlot,
      this.bootsSlot,
    ]
  }

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

  get allItems(): GroupedItem<Item>[] {
    return concat(
      this.cares(),
      compact(this.slots().map(slot => slot.equipment))
    )
  }

  get unarmoredSlotsCount(): number {
    return [
      this.headSlot,
      this.chestSlot,
      this.glovesSlot,
      this.gauntletsSlot,
      this.beltSlot,
      this.bootsSlot,
    ].filter((slot: InventorySlot) => !slot.equipment).length
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
