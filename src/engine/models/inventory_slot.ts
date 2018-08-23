import { Creature } from './creature'
import { Usage, GroupedItem, Item } from './items'
import { intersection } from 'lodash'
import { Inventory } from './inventory'

export abstract class InventorySlot {
  public name: string

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
    this.equipment = null
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

export class BootsSlot extends InventorySlot {
  public name: string = 'Ботинки'
  constructor() {
    super([Usage.Boots], true)
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
      return baseMatch.filter(groupedItem =>
        groupedItem.item.worksWith(missile.item)
      )
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
    let baseMatch = inventory.cares(),
      missileWeapon = inventory.missileWeaponSlot.equipment

    if (missileWeapon) {
      return baseMatch.filter(groupedItem =>
        groupedItem.item.worksWith(missileWeapon.item)
      )
    }

    return baseMatch
  }
}
