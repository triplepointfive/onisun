import { Missile, Protection } from './item'
import { Damage } from '../lib/damage'
import { Clan, Ability } from './creature'
import { Material } from '../lib/material'
import { Gender } from '../lib/gender'

export enum Resistance {
  Intangible,
  MagicDamage,
  TeleportationControl,
  Insulator,
}

export interface CreatureSpecie {
  name: string
  weight: number
  clan: Clan
  abilities: Ability[]

  protections: Protection[]
  damages: Damage[]
  bodyControl: number

  throwingItem?: Missile
  throwingDamages: Damage[]

  maxHealthValue: number
  regenerationRate: number
  regenerationValue: number

  resistances: Resistance[]

  visionRadius: number
  moveSpeed: number
  attackSpeed: number

  leavesCorpseRatio: number

  material: Material
}

export enum Race {
  Human = 'human',
  Dwarf = 'dwarf',
}

export const allRaces: Race[] = [Race.Human, Race.Dwarf]

export enum Color {
  Maroon = 'maroon',
  Red = 'red',
  Orange = 'orange',
  Yellow = 'yellow',
  Olive = 'olive',
  Green = 'green',
  Purple = 'purple',
  Fuchsia = 'fuchsia',
  Lime = 'lime',
  Teal = 'teal',
  Aqua = 'aqua',
  Blue = 'blue',
  Navy = 'navy',
  Black = 'black',
  Gray = 'gray',
  Silver = 'silver',
  White = 'white',
}

export interface PlayerSpecie extends CreatureSpecie {
  race: Race
  gender: Gender
  height: number

  readonly hairColor: Color
  readonly eyeColor: Color
  readonly skinColor: Color
}
