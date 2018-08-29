import { DamageType, ProtectionType } from '../../engine'

//         Light  Medium   Heavy  Solid  Unarmored
// Melee   100%     150%    100%    70%       100%
// Pierce  200%      75%    100%    35%       150%
// Blunt   100%      50%    100%   150%       150%
// Magic   125%      75%    200%    35%       100%
// Pure    100%     100%    100%   100%       100%

const damageToArmorRatio = (
  damageType: DamageType,
  armorType: ProtectionType
): number => {
  switch (damageType) {
    case DamageType.Melee:
      switch (armorType) {
        case ProtectionType.Medium:
          return 1.5
        case ProtectionType.Solid:
          return 0.7
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
          return 2.0
        case ProtectionType.Solid:
          return 0.35
        default:
          return 1
      }
    default:
      return 1
  }
}
