import {
  Creature,
  Clan,
  Pool,
  AICreature,
  DamageType,
  Protection,
  ProtectionType,
  Damage,
  Critical,
} from '../engine'
import { Dispatcher } from './ai'
import { Material } from '../engine/lib/material'

const critical: Critical = { chance: 0.05, multiplier: 2 }

const newCreature = (
  name: string,
  protections: Protection[] = [],
  damages: Damage[]
) => {
  return new AICreature(new Dispatcher(), {
    name: name,
    weight: 10,
    clan: Clan.PlayerOnlyEnemy,
    abilities: [],
    powers: [],
    protections: protections,
    damages: damages,

    maxHealthValue: 1,
    regenerationRate: 5,
    regenerationValue: 1,

    resistances: [],
    visionRadius: 5,

    moveSpeed: 20,
    attackSpeed: 20,
    bodyControl: 5,

    leavesCorpseRatio: 50,
    material: Material.flesh,

    throwingDamages: [],
    critical,
  })
}

export const rat = () => {
  return newCreature(
    'Rat',
    [],
    [{ type: DamageType.Melee, min: 2, max: 4, resistances: [] }]
  )
}

export const golem = () => {
  return newCreature(
    'Golem',
    [{ type: ProtectionType.Solid, value: 5 }],
    [{ type: DamageType.Blunt, min: 11, max: 15, resistances: [] }]
  )
}

export const creaturesPool1 = new Pool<null, Creature>([[100, rat], [3, golem]])
