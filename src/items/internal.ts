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
}

export class Corpse extends Item {
  constructor(public readonly specie: Specie) {
    super(ItemGroup.Consumable, `${specie.name}'s corpse`)
  }
}

export class Missile extends Item {
  constructor(name: string, modifier: Modifier) {
    super(ItemGroup.Missile, name, [Usage.Throw], modifier)
  }
}

export class BodyArmor extends Item {
  constructor(name: string, modifier: Modifier) {
    super(ItemGroup.BodyArmor, name, [Usage.WearsOnBody], modifier)
  }
}

export class OneHandWeapon extends Item {
  constructor(name: string, modifier: Modifier) {
    super(ItemGroup.OneHandWeapon, name, [Usage.WeaponOneHand], modifier)
  }
}
