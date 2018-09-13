import { Player } from './player'
import { Specie } from './specie'

import { Game } from './game'
import { Damage } from '../lib/damage'
import { ImpactType } from '../lib/impact'
import { Material, WaterAffect } from '../lib/material'

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
  Scroll,
}

export enum ItemGroup {
  BodyArmor,
  OneHandWeapon,
  Consumable,
  Missile,
  Potion,
  MissileWeapon,
  Boots,
  Scrolls,
}

export enum ItemSubgroup {
  MissileRock,
  Sling,

  Bow,
  Arrows,
}

export type ItemId = number

export enum CorrosionLevel {
  None,
  Slightly,
  Mostly,
  Fully,
}

export class Item {
  private static lastId: ItemId = 0
  public static getId(): ItemId {
    return this.lastId++
  }

  public impacts: ImpactType[] = []
  public corrosionLevel: CorrosionLevel = CorrosionLevel.None

  constructor(
    public group: ItemGroup,
    public name: string,
    public weight: number,
    public material: Material,
    public readonly usages: Usage[] = [],
    public id: ItemId = Item.getId()
  ) {}

  // TODO: Recalculate stats on corrosion
  public corrode(): boolean {
    switch (this.corrosionLevel) {
      case CorrosionLevel.None:
        this.corrosionLevel = CorrosionLevel.Slightly
        return true
      case CorrosionLevel.Slightly:
        this.corrosionLevel = CorrosionLevel.Mostly
        return true
      case CorrosionLevel.Mostly:
        this.corrosionLevel = CorrosionLevel.Fully
        return true
    }

    return false
  }

  get affectedWithWater(): boolean {
    return this.material.affectedWithWater !== undefined
  }

  get firm(): boolean {
    return this.material.firm
  }

  get insulator(): boolean {
    return this.material.insulator
  }

  get canSeeDetails(): boolean {
    return true
  }

  public clone(): Item {
    return new Item(this.group, this.name, this.weight, this.material)
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
    super(
      ItemGroup.Consumable,
      `${specie.name}'s corpse`,
      specie.weight,
      specie.material
    )
  }
}

export abstract class Potion extends Item {
  constructor(public name: string, material: Material = Material.glass) {
    super(ItemGroup.Potion, name, 0.2, material)
  }

  abstract onDrink(game: Game): void
}

export abstract class Missile extends Item {
  constructor(name: string, weight: number, material: Material) {
    super(ItemGroup.Missile, name, weight, material, [])
  }
}

export abstract class MissileWeapon extends Item {
  constructor(name: string, weight: number, material: Material) {
    super(ItemGroup.MissileWeapon, name, weight, material, [Usage.Shoot])
  }
}

export abstract class Weapon extends Item {
  constructor(
    group: ItemGroup,
    name: string,
    weight: number,
    material: Material,
    protected rawDamages: Damage[],
    usage: Usage
  ) {
    super(group, name, weight, material, [usage])
  }

  get damages(): Damage[] {
    switch (this.corrosionLevel) {
      case CorrosionLevel.Slightly:
        return this.damageWithCorrosion(1)
      case CorrosionLevel.Mostly:
        return this.damageWithCorrosion(2)
      case CorrosionLevel.Fully:
        return this.damageWithCorrosion(4)
      default:
        return this.rawDamages
    }
  }

  protected damageWithCorrosion(penalty: number): Damage[] {
    return this.rawDamages.map(({ dice, type, extra }: Damage) => {
      return { dice, type, extra: extra - penalty }
    })
  }
}

export class OneHandWeapon extends Weapon {
  constructor(
    name: string,
    weight: number,
    material: Material,
    damages: Damage[]
  ) {
    super(
      ItemGroup.OneHandWeapon,
      name,
      weight,
      material,
      damages,
      Usage.WeaponOneHand
    )
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
    material: Material,
    protected readonly rawProtections: Protection[],
    usage: Usage
  ) {
    super(group, name, weight, material, [usage])
  }

  get protections(): Protection[] {
    switch (this.corrosionLevel) {
      case CorrosionLevel.Slightly:
        return this.protectionWithCorrosion(1)
      case CorrosionLevel.Mostly:
        return this.protectionWithCorrosion(2)
      case CorrosionLevel.Fully:
        return this.protectionWithCorrosion(4)
      default:
        return this.rawProtections
    }
  }

  protected protectionWithCorrosion(penalty: number): Protection[] {
    return this.rawProtections.map(({ type, value }: Protection) => {
      return { type, value: value - penalty }
    })
  }
}

export class BodyArmor extends Armor {
  constructor(
    name: string,
    weight: number,
    material: Material,
    protections: Protection[]
  ) {
    super(
      ItemGroup.BodyArmor,
      name,
      weight,
      material,
      protections,
      Usage.WearsOnBody
    )
  }
}

export class Boots extends Armor {
  constructor(
    name: string,
    weight: number,
    material: Material,
    protections: Protection[]
  ) {
    super(ItemGroup.Boots, name, weight, material, protections, Usage.Boots)
  }
}

export class Scroll extends Item {
  constructor(name: string) {
    super(ItemGroup.Scrolls, name, 0.1, Material.paper, [Usage.Scroll])
  }
}
