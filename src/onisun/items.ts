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
  [1, () => new OneHandWeapon('Катана', 1, [{ type: DamageType.Melee, value: 10 }])],
  [3, () => new OneHandWeapon('Топор', 1.5, [{ type: DamageType.Melee, value: 7 }])],
  [7, () => new OneHandWeapon('Кинжал', 0.8, [{ type: DamageType.Melee, value: 3 }])],
  [5, () => new OneHandWeapon('Молот', 5, [{ type: DamageType.Melee, value: 5 }])],
])

export const itemsPool = new Pool<null, Item>([
  [1, () => new BodyArmor('Кольчуга', 5, new Modifier({ defense: 10 }))],
  [5, () => new BodyArmor('Латы', 3, new Modifier({ defense: 5 }))],
  [10, () => new BodyArmor('Роба', 1, new Modifier({ defense: 1 }))],
  [100, () => new HealPotion()],
])

export class LightSpeedBoots extends Boots {
  constructor() {
    super('Кроссовки скорости света', 0.1, new Modifier({}))
  }

  public onPutOn(creature: Creature): void {
    creature.addImpact(ImpactType.Blind, this.name)
  }

  public onTakeOff(creature: Creature): void {
    creature.removeImpact(ImpactType.Blind, this.name)
  }
}
