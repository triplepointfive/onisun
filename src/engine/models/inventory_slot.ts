import { Usage, Item, Missile, Weapon } from './item'
import { intersection } from 'lodash'
import { Inventory } from './inventory'
import { GroupedItem } from '../lib/bunch'
import { Material } from '../../engine'

export abstract class InventorySlot<Equipment extends Item = Item> {
  public name: string = 'InventorySlot'

  constructor(
    // What kind of items can be put in slot
    public readonly usages: Usage[],
    // Has to put only a single item or can put a bunch of them
    public readonly useSingleItem: boolean,
    public equipment?: GroupedItem<Equipment>
  ) {}

  public matchingItems(inventory: Inventory): GroupedItem<Item>[] {
    return inventory.cares().filter(itemGroup => this.match(itemGroup.item))
  }

  get insulator(): boolean {
    return !!(this.equipment && this.equipment.item.insulator)
  }

  get firm(): boolean {
    return !!(this.equipment && this.equipment.item.firm)
  }

  public equip(item: Equipment, count: number) {
    if (this.equipment) {
      throw `Slot ${this.name} is already equipped with ${this.equipment.item}`
    }

    this.equipment = { count, item }
  }

  public takeOff(): void {
    if (!this.equipment) {
      throw `Slot ${this.name} has nothing to take off`
    }

    this.equipment = undefined
  }

  protected match(item: Item): boolean {
    return intersection(item.usages, this.usages).length > 0
  }

  protected withPairItem(
    baseMatch: GroupedItem<Item>[],
    item: Item
  ): GroupedItem<Item>[] {
    return baseMatch.filter(groupedItem => groupedItem.item.worksWith(item))
  }
}

export abstract class BodyPart<
  Equipment extends Item = Item
> extends InventorySlot<Equipment> {
  public abstract material: Material

  get affectedWithWater(): boolean {
    return this.material.affectedWithWater !== undefined
  }
}

export class RightHandSlot extends BodyPart<Weapon> {
  public name: string = 'Правая рука'
  constructor(public material: Material) {
    super([Usage.WeaponOneHand], true)
  }
}

export class LeftHandSlot extends BodyPart<Weapon> {
  public name: string = 'Левая рука'
  constructor(public material: Material) {
    super([Usage.WeaponOneHand], true)
  }
}

export class HeadSlot extends BodyPart {
  public name: string = 'Голова'
  constructor(public material: Material) {
    super([Usage.WearsOnHead], true)
  }
}

export class ChestSlot extends BodyPart {
  public name: string = 'Корпус'
  constructor(public material: Material) {
    super([Usage.WearsOnBody], true)
  }
}

export class BootsSlot extends BodyPart {
  public name: string = 'Ботинки'
  constructor(public material: Material) {
    super([Usage.Boots], true)
  }
}

export class GlovesSlot extends InventorySlot {
  public name: string = 'Перчатки'
  constructor() {
    super([Usage.Gloves], true)
  }
}

export class GauntletsSlot extends InventorySlot {
  public name: string = 'Наручи'
  constructor() {
    super([Usage.Gauntlets], true)
  }
}

export class BeltSlot extends InventorySlot {
  public name: string = 'Пояс'
  constructor() {
    super([Usage.Belt], true)
  }
}

export class AmuletSlot extends InventorySlot {
  public name: string = 'Амулет'
  constructor() {
    super([Usage.Amulet], true)
  }
}

export class LeftFingerSlot extends InventorySlot {
  public name: string = 'Левый палец'
  constructor() {
    super([Usage.Ring], true)
  }
}

export class RightFingerSlot extends InventorySlot {
  public name: string = 'Правый палец'
  constructor() {
    super([Usage.Ring], true)
  }
}

export class CloakSlot extends InventorySlot {
  public name: string = 'Плащ'
  constructor() {
    super([Usage.Cloak], true)
  }
}

export class MissileWeaponSlot extends InventorySlot<Weapon> {
  public name: string = 'Метательное'
  constructor() {
    super([Usage.Shoot], true)
  }

  public matchingItems(inventory: Inventory): GroupedItem<Item>[] {
    let baseMatch = super.matchingItems(inventory),
      missile = inventory.missileSlot.equipment

    if (missile) {
      return this.withPairItem(baseMatch, missile.item)
    }

    return baseMatch
  }
}

export class MissileSlot extends InventorySlot<Missile> {
  public name: string = 'Снаряды'
  constructor() {
    super([Usage.Throw], false)
  }

  public matchingItems(inventory: Inventory): GroupedItem<Item>[] {
    let baseMatch = inventory.cares(),
      missileWeapon = inventory.missileWeaponSlot.equipment

    if (missileWeapon) {
      return this.withPairItem(baseMatch, missileWeapon.item)
    }

    return baseMatch
  }
}

export class ToolsSlot extends InventorySlot {
  public name: string = 'Инструмент'
  constructor() {
    super([Usage.Tool], true)
  }
}
