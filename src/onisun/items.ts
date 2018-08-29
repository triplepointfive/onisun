import {
  Missile,
  MissileWeapon,
  Item,
  Modifier,
  Player,
  OneHandWeapon,
  BodyArmor,
  Pool,
  Creature,
  Boots,
  ImpactType,
  DamageType,
} from '../engine'
import { HealPotion } from './potions'
import { ProtectionType } from '../engine/models/items'

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

const noMod = new Modifier({})

export const commonBow = () => new Bow('Обычный лук', 1, noMod)

export const smallRock = () => new MissileRock('Маленький камень', 0.3, noMod)

export const woodenArrow = () => new Arrow('Деревянная стрела', 0.2, noMod)
export const ironArrow = () => new Arrow('Железная стрела', 0.25, noMod)

export const weapons = new Pool<null, Item>([
  [
    1,
    () =>
      new OneHandWeapon('Катана', 1, [
        { type: DamageType.Melee, dice: { times: 5, max: 2 }, extra: 0 },
      ]),
  ],
  [
    7,
    () =>
      new OneHandWeapon('Кинжал', 0.8, [
        { type: DamageType.Melee, dice: { times: 1, max: 3 }, extra: 2 },
      ]),
  ],
])

export const itemsPool = new Pool<null, Item>([
  [
    1,
    () =>
      new BodyArmor('Кольчуга', 5, [{ type: ProtectionType.Medium, value: 3 }]),
  ],
  [
    5,
    () => new BodyArmor('Латы', 3, [{ type: ProtectionType.Heavy, value: 5 }]),
  ],
  [
    10,
    () =>
      new BodyArmor('Роба', 1, [{ type: ProtectionType.Unarmored, value: 1 }]),
  ],
  [100, () => new HealPotion()],
])

export class LightSpeedBoots extends Boots {
  constructor() {
    super('Кроссовки скорости света', 0.1, [])
  }

  public onPutOn(creature: Creature): void {
    creature.addImpact(ImpactType.Blind, this.name)
  }

  public onTakeOff(creature: Creature): void {
    creature.removeImpact(ImpactType.Blind, this.name)
  }
}
