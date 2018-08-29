import { Creature } from './creature'
import { Usage, Item } from './items'
import { intersection } from 'lodash'
import { Inventory } from './inventory'
import { GroupedItem } from '../lib/bunch'

export abstract class InventorySlot {
  public name: string = 'InventorySlot'

  constructor(
    // What kind of items can be put in slot
    public readonly usages: Usage[],
    // Has to put only a single item or can put a bunch of them
    public readonly useSingleItem: boolean,
    public equipment?: GroupedItem<Item>
  ) {}

  public matchingItems(inventory: Inventory): GroupedItem<Item>[] {
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

    if (groupItem === undefined) {
      throw `Item ${item.name} can not be equipped - not found in inventory`
    }

    // TODO: assert that can't equip more than have in inventory
    // TODO: assert can equip
    if (this.equipment) {
      this.takeOff(actor)
    }
    const count = this.useSingleItem ? 1 : groupItem.count
    this.equipment = { count, item }
    inventory.removeFromBag(item, count)
    item.onPutOn(actor)
  }

  public takeOff(actor: Creature): void {
    if (!this.equipment) {
      throw `Slot ${this.name} has nothing to take off`
    }

    actor.inventory.putToBag(this.equipment.item, this.equipment.count)
    this.equipment.item.onTakeOff(actor)
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

export class HeadSlot extends InventorySlot {
  public name: string = 'Голова'
  constructor() {
    super([Usage.WearsOnHead], true)
  }
}

export class ChestSlot extends InventorySlot {
  public name: string = 'Корпус'
  constructor() {
    super([Usage.WearsOnBody], true)
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

export class BootsSlot extends InventorySlot {
  public name: string = 'Ботинки'
  constructor() {
    super([Usage.Boots], true)
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

export class MissileWeaponSlot extends InventorySlot {
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

export class MissileSlot extends InventorySlot {
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
