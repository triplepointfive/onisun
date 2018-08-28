import { DamageType, ArmorType } from '../../engine'

//         Light  Medium   Heavy  Solid  Unarmored
// Melee   100%     150%    100%    70%       100%
// Pierce  200%      75%    100%    35%       150%
// Blunt   100%      50%    100%   150%       150%
// Magic   125%      75%    200%    35%       100%
// Pure    100%     100%    100%   100%       100%

const damageToArmorRatio = (
  damageType: DamageType,
  armorType: ArmorType
): number => {
  switch (damageType) {
    case DamageType.Melee:
      switch (armorType) {
        case ArmorType.Medium:
          return 1.5
        case ArmorType.Solid:
          return 0.7
        default:
          return 1
      }
    case DamageType.Pierce:
      switch (armorType) {
        case ArmorType.Light:
          return 2.0
        case ArmorType.Medium:
          return 0.75
        case ArmorType.Solid:
          return 0.35
        case ArmorType.Unarmored:
          return 1.5
        default:
          return 1
      }
    case DamageType.Blunt:
      switch (armorType) {
        case ArmorType.Medium:
          return 0.5
        case ArmorType.Solid:
          return 1.5
        case ArmorType.Unarmored:
          return 1.5
        default:
          return 1
      }
    case DamageType.Magic:
      switch (armorType) {
        case ArmorType.Light:
          return 1.25
        case ArmorType.Medium:
          return 0.75
        case ArmorType.Heavy:
          return 2.0
        case ArmorType.Solid:
          return 0.35
        default:
          return 1
      }
    default:
      return 1
  }
}
