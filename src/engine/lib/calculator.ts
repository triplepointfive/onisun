import { includes, intersection, random, sum, sumBy } from 'lodash'
import { DamageType, ProtectionType } from '../../engine'
import { Protection } from '../models/item'
import { Resistance, Critical } from '../models/specie'
import { Damage } from './damage'

export type DamageOrResist = { damage: number; resist: boolean }

export class Calculator {
  private constructor() {}

  public static withCritical(
    damages: Damage[],
    { chance, multiplier }: Critical
  ): Damage[] {
    if (Math.random() > chance) {
      return damages
    }

    return damages.map(
      ({ type, min, max, resistances }): Damage => {
        return {
          type,
          min: min * multiplier,
          max: max * multiplier,
          resistances,
        }
      }
    )
  }

  public static misses(attackerBC: number, victimBC: number): boolean {
    return (
      Math.random() > attackerBC / (attackerBC + Math.pow(victimBC * 0.25, 0.8))
    )
  }

  // Random with luck based align to get low value
  public static lowerWeight(max: number, min: number = 1): number {
    let count = 0

    for (let i = min; i < max; i++) {
      if (this.chance(1, 3)) {
        count += 1
      }
    }

    return Math.max(1, count)
  }
  // Random with luck based align to get high value
  public static higherWeight(max: number, min: number = 1): number {
    return max + min - this.lowerWeight(max, min)
  }

  public static chance(hit: number, of: number): boolean {
    return random(1, of) <= hit
  }

  // Function result varies from 0 to 1. Ratio defines the speed of growing.
  // E.g. dodges(10, 1) = 0.93
  //      dodges(10, 5) = 0.7
  public static dodges(actorBC: number, ratio: number): boolean {
    return Math.random() < (Math.atan(actorBC / ratio) / Math.PI) * 2
  }

  public static damage(
    damages: Damage[],
    protectionTypes: Protection[],
    victimResistances: Resistance[]
  ): DamageOrResist {
    if (
      damages.every(({ type, resistances }) =>
        this.resistTo(type, resistances, victimResistances)
      )
    ) {
      return { damage: 0, resist: true }
    }

    const damage = sumBy(
      damages,
      ({ min, max, type, resistances }): number => {
        if (this.resistTo(type, resistances, victimResistances)) {
          return 0
        }

        return Math.floor(
          Math.max(
            0,
            this.dropDice(min, max) -
              this.protectionValue(type, protectionTypes)
          )
        )
      }
    )

    return { damage, resist: false }
  }

  protected static resistTo(
    damageType: DamageType,
    resistances: Resistance[],
    victimResistances: Resistance[]
  ): boolean {
    if (intersection(victimResistances, resistances).length) {
      return true
    }

    switch (damageType) {
      case DamageType.Melee:
      case DamageType.Pierce:
      case DamageType.Blunt:
        return includes(victimResistances, Resistance.Intangible)
      case DamageType.Magic:
        return includes(victimResistances, Resistance.MagicDamage)
      case DamageType.Pure:
        return false
    }
  }

  protected static dropDice(min: number, max: number): number {
    return random(min, max)
  }

  protected static protectionValue(
    damageType: DamageType,
    protections: Protection[]
  ): number {
    return sum(
      protections.map(
        ({ type, value }: Protection): number =>
          value * this.armorToDamageRatio(damageType, type)
      )
    )
  }

  protected static armorToDamageRatio = (
    damageType: DamageType,
    armorType: ProtectionType
  ): number => {
    switch (damageType) {
      case DamageType.Melee:
        switch (armorType) {
          case ProtectionType.Medium:
            return 2 / 3
          case ProtectionType.Solid:
            return 4 / 3
          default:
            return 1
        }
      case DamageType.Pierce:
        switch (armorType) {
          case ProtectionType.Light:
            return 1 / 2
          case ProtectionType.Medium:
            return 4 / 3
          case ProtectionType.Solid:
            return 3
          case ProtectionType.Unarmored:
            return 3 / 4
          default:
            return 1
        }
      case DamageType.Blunt:
        switch (armorType) {
          case ProtectionType.Medium:
            return 2
          case ProtectionType.Solid:
            return 1 / 2
          case ProtectionType.Unarmored:
            return 1 / 2
          default:
            return 1
        }
      case DamageType.Magic:
        switch (armorType) {
          case ProtectionType.Light:
            return 5 / 4
          case ProtectionType.Medium:
            return 3 / 4
          case ProtectionType.Heavy:
            return 1 / 2
          case ProtectionType.Solid:
            return 3
          default:
            return 1
        }
      case DamageType.Pure:
        return 0
      default:
        throw 'Got unknown type of damage!'
    }
  }
}
