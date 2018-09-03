import { Damage, Missile, Protection } from './items'
import { Clan, Ability } from './creature'

export interface Specie {
  readonly name: string
  readonly weight: number
  readonly clan: Clan
  readonly abilities: Ability[]

  protections: Protection[]
  damages: Damage[]

  throwingItem?: Missile

  maxHealthValue: number
  regenerationRate: number
  regenerationValue: number
}
