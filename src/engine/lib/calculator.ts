import { DamageType, ProtectionType } from '../../engine'
import { Damage, Dice, Protection } from '../models/items'

import { sumBy, times, sum, random } from 'lodash'

export class Calculator {
  private constructor() {}

  public static damage(
    damages: Damage[],
    protectionTypes: Protection[]
  ): number {
    return sumBy(
      damages,
      ({ extra, dice, type }): number => {
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
          value / this.armorToDamageRatio(damageType, type)
      )
    )
  }

  protected static armorToDamageRatio = (
    damageType: DamageType,
    armorType: ProtectionType
  ): number => {
    //         Light  Medium   Heavy  Solid  Unarmored
    // Melee       1     2/3       1    4/3          1
    // Pierce   200%     75%    100%    35%       150%
    // Blunt    100%     50%    100%   150%       150%
    // Magic    125%     75%     1/2      3       100%
    // Pure        0       0       0      0          0
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
            return 2.0
          case ProtectionType.Medium:
            return 0.75
          case ProtectionType.Solid:
            return 0.35
          case ProtectionType.Unarmored:
            return 1.5
          default:
            return 1
        }
      case DamageType.Blunt:
        switch (armorType) {
          case ProtectionType.Medium:
            return 0.5
          case ProtectionType.Solid:
            return 1.5
          case ProtectionType.Unarmored:
            return 1.5
          default:
            return 1
        }
      case DamageType.Magic:
        switch (armorType) {
          case ProtectionType.Light:
            return 1.25
          case ProtectionType.Medium:
            return 0.75
          case ProtectionType.Heavy:
            return 0.5
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
