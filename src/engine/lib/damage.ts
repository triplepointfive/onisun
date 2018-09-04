import { Resistance } from '../models/specie'

export enum DamageType {
  Melee,
  Pierce,
  Blunt,
  Magic,
  Pure,
}

export type Dice = {
  times: number
  max: number
}

export type Damage = {
  extra: number
  dice: Dice
  type: DamageType
  resistances?: Resistance[]
}
