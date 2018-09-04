import { DamageType, ProtectionType } from '../../engine'
import { Protection } from '../models/items'
import { Damage, Dice } from './damage'

import { sumBy, times, sum, random, includes, intersection } from 'lodash'
import { Resistance } from '../models/specie'

export type DamageOrResist = { damage: number; resist: boolean }

export class Calculator {
  private constructor() {}

  public static misses(attackerDex: number, victimDex: number): boolean {
    return (
      Math.random() >
      attackerDex / (attackerDex + Math.pow(victimDex * 0.25, 0.8))
    )
  }

  public static throwMisses(attackerDex: number, victimDex: number): boolean {
    return this.misses(attackerDex, victimDex)
  }

  public static throwDamageTo(x: number, y: number): number {
    return 10
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
      ({ extra, dice, type, resistances }): number => {
        if (this.resistTo(type, resistances, victimResistances)) {
          return 0
        }

        return Math.floor(
          Math.max(
            0,
            extra +
              this.dropDice(dice) -
              this.protectionValue(type, protectionTypes)
          )
        )
      }
    )

    return { damage, resist: false }
  }

  protected static resistTo(
    damageType: DamageType,
    resistances: Resistance[] | undefined,
    victimResistances: Resistance[]
  ): boolean {
    if (resistances && intersection(victimResistances, resistances).length) {
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

  protected static dropDice(dice: Dice): number {
    return sum(times(dice.times, () => random(1, dice.max)))
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
