import { Specie, Creature, Player } from './creature'

import { remove } from 'lodash'
import { Game } from './game'
import { Modifier } from '../lib/attribute'

export enum Usage {
  WeaponOneHand,
  WearsOnBody,
  Throw,
  Shoot,
  Boots,
}

export enum ItemGroup {
  BodyArmor,
  OneHandWeapon,
  Consumable,
  Missile,
  Potion,
  MissileWeapon,
  Boots,
}

export enum ItemSubgroup {
  MissileRock,
  Sling,

  Bow,
  Arrows,
}

export type ItemId = number

export class Item {
  private static lastId: ItemId = 0
  public static getId(): ItemId {
    return this.lastId++
  }
  public weight: number = 100

  constructor(
    public group: ItemGroup,
    public name: string,
    public readonly usages: Usage[] = [],
    public readonly modifier: Modifier = new Modifier({}),
    public id: ItemId = Item.getId()
  ) {}

  public clone(): Item {
    return new Item(this.group, this.name)
  }

  public onPutOn(creature: Creature): void {
    creature.characteristics.addModifier(this.modifier)
  }

  public onTakeOff(creature: Creature): void {
    creature.characteristics.removeModifier(this.modifier)
  }

  public groupsWith(item: Item): boolean {
    return this.name === item.name
  }

  public worksWith(item: Item): boolean {
    return false
  }

  public canThrow(player: Player): boolean {
    return true
  }
}

let inventoryItemId = 1
export class GroupedItem {
  public id: number

  constructor(public count: number, public item: Item) {
    this.id = inventoryItemId++
  }

  public groupsWith(item: Item): boolean {
    return this.item.groupsWith(item)
  }
}

export class ItemsBunch {
  public bunch: GroupedItem[] = []

  public find(item: Item): GroupedItem {
    return this.bunch.find(invItem => invItem.groupsWith(item))
  }

  public remove(item: Item, count: number): void {
    const invItem: GroupedItem = this.find(item)

    if (!invItem) {
      // TODO: Fail if removes item that's not in bunch yet?
      return
    } else if (invItem.count === count) {
      remove(this.bunch, inventoryItem => inventoryItem.id === invItem.id)
    } else {
      invItem.count -= count
    }
  }

  public put(item: Item, count: number): void {
    const invItem = this.bunch.find(inv => inv.groupsWith(item))

    if (invItem) {
      invItem.count += count
    } else {
      this.bunch.push(new GroupedItem(count, item))
    }
  }

  public clone(): ItemsBunch {
    let bunch = new ItemsBunch()

    this.bunch.forEach(groupedItem => {
      bunch.put(groupedItem.item, groupedItem.count)
    })

    return bunch
  }
}

export class Corpse extends Item {
  constructor(public readonly specie: Specie) {
    super(ItemGroup.Consumable, `${specie.name}'s corpse`)
  }
}

export abstract class Potion extends Item {
  constructor(public name: string) {
    super(ItemGroup.Potion, name)
  }

  abstract onDrink(game: Game): void
}

export abstract class Missile extends Item {
  constructor(name: string, modifier: Modifier) {
    super(ItemGroup.Missile, name, [], modifier)
  }
}

export abstract class MissileWeapon extends Item {
  constructor(name: string, modifier: Modifier) {
    super(ItemGroup.MissileWeapon, name, [Usage.Shoot], modifier)
  }
}

export class BodyArmor extends Item {
  constructor(name: string, modifier: Modifier) {
    super(ItemGroup.BodyArmor, name, [Usage.WearsOnBody], modifier)
  }
}

export class OneHandWeapon extends Item {
  constructor(name: string, modifier: Modifier) {
    super(ItemGroup.MissileWeapon, name, [Usage.WeaponOneHand], modifier)
  }
}

export class Boots extends Item {
  constructor(name: string, modifier: Modifier) {
    super(ItemGroup.Boots, name, [Usage.Boots], modifier)
  }
}
