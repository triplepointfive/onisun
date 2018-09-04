import { Missile, Protection } from './items'
import { Damage } from "../lib/damage";
import { Clan, Ability } from './creature'

export enum Resistance {
  PhysicalDamage,
  MagicDamage,
}

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

  resistances: Resistance[]
}
