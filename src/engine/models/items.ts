import { Player } from './player'
import { Specie } from './specie'

import { Game } from './game'
import { Modifier } from '../lib/attribute'
import { Damage } from '../lib/damage';

export enum Usage {
  WeaponOneHand,
  WearsOnHead,
  WearsOnBody,
  Ring,
  Amulet,
  Throw,
  Shoot,
  Boots,
  Tool,
  Belt,
  Gloves,
  Gauntlets,
  Cloak,
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

  get canSeeDetails(): boolean {
    return true
  }

  public clone(): Item {
    return new Item(this.group, this.name, this.weight)
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

export abstract class Weapon extends Item {
  constructor(
    group: ItemGroup,
    name: string,
    weight: number,
    public readonly damages: Damage[],
    usage: Usage
  ) {
    super(group, name, weight, [usage])
  }
}

export class OneHandWeapon extends Weapon {
  constructor(name: string, weight: number, damages: Damage[]) {
    super(ItemGroup.OneHandWeapon, name, weight, damages, Usage.WeaponOneHand)
  }
}

export enum ProtectionType {
  Light,
  Medium,
  Heavy,
  Solid,
  Unarmored,
}

export type Protection = {
  type: ProtectionType
  value: number
}

export abstract class Armor extends Item {
  constructor(
    group: ItemGroup,
    name: string,
    weight: number,
    public readonly protections: Protection[],
    usage: Usage
  ) {
    super(group, name, weight, [usage])
  }
}

export class BodyArmor extends Armor {
  constructor(name: string, weight: number, protections: Protection[]) {
    super(ItemGroup.BodyArmor, name, weight, protections, Usage.WearsOnBody)
  }
}

export class Boots extends Armor {
  constructor(name: string, weight: number, protections: Protection[]) {
    super(ItemGroup.Boots, name, weight, protections, Usage.Boots)
  }
}
