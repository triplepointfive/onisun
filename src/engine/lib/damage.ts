import { Resistance } from '../models/specie'

export enum DamageType {
  Melee,
  Pierce,
  Blunt,
  Magic,
  Pure,
}

export type Damage = {
  min: number
  max: number
  type: DamageType
  resistances: Resistance[] // TODO! Make mandatory
}
