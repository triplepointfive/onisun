import {
  BodyArmor,
  Boots,
  DamageType,
  ImpactType,
  Item,
  Missile,
  MissileWeapon,
  OneHandWeapon,
  Player,
  Pool,
  ProtectionType,
  Weapon,
} from '../engine'
import { HealPotion } from './potions'
import { Material } from '../engine/lib/material'

class MissileRock extends Missile {
  public worksWith(item: Item): boolean {
    return item instanceof Sling
  }
}

class Arrow extends Missile {
  public worksWith(item: Item): boolean {
    return item instanceof Bow
  }

  public canThrow(player: Player): boolean {
    return !!player.inventory.missileWeaponSlot.equipment
  }
}

class Sling extends MissileWeapon {
  public worksWith(item: Item): boolean {
    return item instanceof MissileRock
  }
}

class Bow extends MissileWeapon {
  public worksWith(item: Item): boolean {
    return item instanceof Arrow
  }
}

export const commonBow = () =>
  new Bow(
    'Обычный лук',
    1,
    [{ type: DamageType.Pierce, min: 4, max: 6, resistances: [] }],
    Material.wood
  )

export const smallRock = () =>
  new MissileRock(
    'Маленький камень',
    0.3,
    [{ type: DamageType.Blunt, min: 3, max: 5, resistances: [] }],
    Material.stone
  )

export const woodenArrow = () =>
  new Arrow(
    'Деревянная стрела',
    0.2,
    [{ type: DamageType.Pierce, min: 4, max: 7, resistances: [] }],
    Material.wood
  )
export const ironArrow = () =>
  new Arrow(
    'Железная стрела',
    0.25,
    [{ type: DamageType.Pierce, min: 5, max: 9, resistances: [] }],
    Material.iron
  )

export const weapons = new Pool<null, Weapon>([
  [
    1,
    () =>
      new OneHandWeapon('Катана', 1, Material.iron, [
        { type: DamageType.Melee, min: 5, max: 10, resistances: [] },
      ]),
  ],
  [
    7,
    () =>
      new OneHandWeapon('Кинжал', 0.8, Material.iron, [
        { type: DamageType.Melee, min: 3, max: 5, resistances: [] },
      ]),
  ],
])

export const itemsPool = new Pool<null, Item>([
  [
    1,
    () =>
      new BodyArmor('Кольчуга', 5, Material.iron, [
        { type: ProtectionType.Medium, value: 3 },
      ]),
  ],
  [
    5,
    () =>
      new BodyArmor('Латы', 3, Material.iron, [
        { type: ProtectionType.Heavy, value: 5 },
      ]),
  ],
  [
    10,
    () =>
      new BodyArmor('Роба', 1, Material.iron, [
        { type: ProtectionType.Unarmored, value: 1 },
      ]),
  ],
  [100, () => new HealPotion()],
])

export class LightSpeedBoots extends Boots {
  public impacts: ImpactType[] = [ImpactType.Blind]

  constructor() {
    super('Кроссовки скорости света', 0.1, Material.cloth, [])
  }
}
