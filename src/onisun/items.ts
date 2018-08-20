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
} from '../engine'
import { HealPotion } from './potions'
import { Boots } from '../engine/items';

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

export const commonBow = () => new Bow('Common bow', noMod)

export const smallRock = () => new MissileRock('Small rock', noMod)

export const woodenArrow = () => new Arrow('Wooden arrow', noMod)
export const ironArrow = () => new Arrow('Iron arrow', noMod)

export const weapons = new Pool<null, Item>([
  [1, () => new OneHandWeapon('Katana', new Modifier({ attack: 10 }))],
  [3, () => new OneHandWeapon('Axe', new Modifier({ attack: 7 }))],
  [7, () => new OneHandWeapon('Dagger', new Modifier({ attack: 3 }))],
  [5, () => new OneHandWeapon('Hammer', new Modifier({ attack: 5 }))],
])

export const itemsPool = new Pool<null, Item>([
  [1, () => new BodyArmor('Кольчуга', new Modifier({ defense: 10 }))],
  [5, () => new BodyArmor('Латы', new Modifier({ defense: 5 }))],
  [10, () => new BodyArmor('Роба', new Modifier({ defense: 1 }))],
  [100, () => new HealPotion()],
])

export class LightSpeedBoots extends Boots {
  constructor() {
    super('Кроссовки скорости света', new Modifier({}))
  }

  public onPutOn(creature: Creature): void {
  }

  public onTakeOff(creature: Creature): void {
  }
}
