import { Specie, Creature } from '../creature'
import { Modifier } from '../characteristics'

export enum Usage {
  WeaponOneHand,
  WearsOnBody,
  Throw,
}

export enum ItemGroup {
  BodyArmor,
  OneHandWeapon,
  Consumable,
  Missile,
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
    public readonly usages: Usage[] = [],
    public id: ItemId = Item.getId()
  ) {}

  public clone(): Item {
    return new Item(this.group, this.name)
  }
}

export class Corpse extends Item {
  constructor(public readonly specie: Specie) {
    super(ItemGroup.Consumable, `${specie.name}'s corpse`)
  }
}

export abstract class Equipment extends Item {
  constructor(
    group: ItemGroup,
    name: string,
    public readonly modifier: Modifier,
    usages: Usage[] = []
  ) {
    super(group, name, usages)
  }

  public onPutOn(creature: Creature): void {
    creature.characteristics.addModifier(this.modifier)
  }

  public onTakeOff(creature: Creature): void {
    creature.characteristics.removeModifier(this.modifier)
  }
}

export class Missile extends Equipment {
  constructor(name: string, modifier: Modifier) {
    super(ItemGroup.Missile, name, modifier, [Usage.Throw])
  }
}

export class BodyArmor extends Equipment {
  constructor(name: string, modifier: Modifier) {
    super(ItemGroup.BodyArmor, name, modifier, [Usage.WearsOnBody])
  }
}

export class OneHandWeapon extends Equipment {
  constructor(name: string, modifier: Modifier) {
    super(ItemGroup.OneHandWeapon, name, modifier, [Usage.WeaponOneHand])
  }
}
