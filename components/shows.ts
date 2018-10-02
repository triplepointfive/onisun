import { Item, Weapon, Armor, DamageType, ProtectionType, Damage, Protection } from '../src/onisun'

export const showItemDetails = function(item: Item): string | undefined {
  if (item instanceof Weapon) {
    return item.damages.map(showDamage).join(',')
  } else if (item instanceof Armor) {
    return item.protections.map(showProtection).join(',')
  }
}

export const showDamage = function({ min, max, type }: Damage): string {
  return `${showDamageType(type)} ${min}-${max}`
}

export const showDamageType = function(damageType: DamageType): string {
  switch (damageType) {
  case DamageType.Melee:
    return 'Me'
  case DamageType.Pierce:
    return 'Pi'
  case DamageType.Blunt:
    return 'B'
  case DamageType.Magic:
    return 'Mg'
  case DamageType.Pure:
    return 'Pu'
  default:
    return 'unknown damage type'
  }
}

export const showProtection = function({ type, value } : Protection): string {
  switch (type) {
  case ProtectionType.Light:
    return `L${value}`
  case ProtectionType.Medium:
    return `M${value}`
  case ProtectionType.Heavy:
    return `H${value}`
  case ProtectionType.Solid:
    return `S${value}`
  case ProtectionType.Unarmored:
    return `U${value}`
  default:
    return 'unknown protection type'
  }
}
