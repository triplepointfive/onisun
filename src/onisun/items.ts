import { Missile, MissileWeapon, Item, Modifier } from '../engine'

class MissileRock extends Missile {
  public worksWith(item: Item): boolean {
    return item instanceof Sling
  }
}

class Arrow extends Missile {
  public worksWith(item: Item): boolean {
    return item instanceof Bow
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
