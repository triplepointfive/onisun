import { Specie } from './specie'
import { Item } from './items'
import {
  AttributeSet,
  Attribute,
  PositiveAttribute,
  Modifier,
} from '../lib/attribute'

export class Characteristics extends AttributeSet<Attribute> {
  constructor({
    attack,
    defense,
    dexterity,
    radius,
    speed,
  }: {
    attack: number
    defense: number
    dexterity: number
    radius: number
    speed: number
  }) {
    super(
      new PositiveAttribute(attack),
      new PositiveAttribute(defense),
      new PositiveAttribute(dexterity),
      new PositiveAttribute(radius),
      new PositiveAttribute(speed)
    )
  }

  public addModifier(modifier: Modifier) {
    this.with(modifier, (char, mod) => {
      if (mod !== 0) {
        char.addModifier(mod)
      }
    })
  }

  public removeModifier(modifier: Modifier) {
    this.with(modifier, (char, mod) => {
      if (mod !== 0) {
        char.removeModifier(mod)
      }
    })
  }

  public misses(victim: Characteristics): boolean {
    let dex = this.dexterity.currentValue

    return (
      Math.random() >
      dex / (dex + Math.pow(victim.dexterity.currentValue * 0.25, 0.8))
    )
  }

  public throwMisses(victim: Characteristics): boolean {
    return this.misses(victim)
  }

  public throwDamageTo(victim: Characteristics, missile: Item): number {
    // TODO
    return 10
  }

  public levelUp(specie: Specie) {
    // this.health.constantIncrease(3)

    if (Math.random() > 0.5) {
      this.attack.constantIncrease(1)
    } else {
      this.defense.constantIncrease(1)
    }
  }
}
