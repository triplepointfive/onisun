import {
  Creature,
  Clan,
  Pool,
  AICreature,
  DamageType,
  Protection,
  ProtectionType,
  Damage,
} from '../engine'
import { Dispatcher } from './ai'
import { Material } from '../engine/lib/material'

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
  })
}

export const rat = () => {
  return newCreature(
    'Rat',
    [],
    [{ type: DamageType.Melee, dice: { times: 2, max: 2 }, extra: 0 }]
  )
}

export const golem = () => {
  return newCreature(
    'Golem',
    [{ type: ProtectionType.Solid, value: 5 }],
    [{ type: DamageType.Blunt, dice: { times: 1, max: 5 }, extra: 10 }]
  )
}

export const creaturesPool1 = new Pool<null, Creature>([[100, rat], [3, golem]])
