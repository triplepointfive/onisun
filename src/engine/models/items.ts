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

  constructor(
    public group: ItemGroup,
    public name: string,
    public weight: number,
    public readonly usages: Usage[] = [],
    public readonly modifier: Modifier = new Modifier({}),
    public id: ItemId = Item.getId()
  ) {}

  public clone(): Item {
    return new Item(this.group, this.name, this.weight)
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

export interface GroupedItem {
  count: number
  item: Item
}

export class ItemsBunch {
  public bunch: GroupedItem[] = []

  public find(item: Item): GroupedItem | undefined {
    return this.bunch.find(invItem => invItem.item.groupsWith(item))
  }

  public remove(item: Item, count: number): void {
    const invItem = this.find(item)

    if (invItem === undefined) {
      // TODO: Fail if removes item that's not in bunch yet?
      return
    } else if (invItem.count === count) {
      remove(this.bunch, inventoryItem =>
        inventoryItem.item.groupsWith(invItem.item)
      )
    } else {
      invItem.count -= count
    }
  }

  public put(item: Item, count: number): void {
    const invItem = this.bunch.find(inv => inv.item.groupsWith(item))

    if (invItem) {
      invItem.count += count
    } else {
      this.bunch.push({ count: count, item: item })
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
    super(ItemGroup.Consumable, `${specie.name}'s corpse`, specie.weight)
  }
}

export abstract class Potion extends Item {
  constructor(public name: string) {
    super(ItemGroup.Potion, name, 0.2)
  }

  abstract onDrink(game: Game): void
}

export abstract class Missile extends Item {
  constructor(name: string, weight: number, modifier: Modifier) {
    super(ItemGroup.Missile, name, weight, [], modifier)
  }
}

export abstract class MissileWeapon extends Item {
  constructor(name: string, weight: number, modifier: Modifier) {
    super(ItemGroup.MissileWeapon, name, weight, [Usage.Shoot], modifier)
  }
}

export class BodyArmor extends Item {
  constructor(name: string, weight: number, modifier: Modifier) {
    super(ItemGroup.BodyArmor, name, weight, [Usage.WearsOnBody], modifier)
  }
}

export class OneHandWeapon extends Item {
  constructor(name: string, weight: number, modifier: Modifier) {
    super(
      ItemGroup.MissileWeapon,
      name,
      weight,
      [Usage.WeaponOneHand],
      modifier
    )
  }
}

export class Boots extends Item {
  constructor(name: string, weight: number, modifier: Modifier) {
    super(ItemGroup.Boots, name, weight, [Usage.Boots], modifier)
  }
}
