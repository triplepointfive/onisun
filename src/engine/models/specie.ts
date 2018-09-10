import { Missile, Protection } from './item'
import { Damage } from '../lib/damage'
import { Clan, Ability } from './creature'
import { Material } from '../lib/material'

export enum Resistance {
  Intangible,
  MagicDamage,
  TeleportationControl,
  Insulator,
}

export interface Specie {
  name: string
  weight: number
  clan: Clan
  abilities: Ability[]

  protections: Protection[]
  damages: Damage[]
  bodyControl: number

  throwingItem?: Missile

  maxHealthValue: number
  regenerationRate: number
  regenerationValue: number

  resistances: Resistance[]

  visionRadius: number
  moveSpeed: number
  attackSpeed: number

  leavesCorpseRatio: number
  corpseMaterial: Material
}
