import {
  Characteristics,
  Creature,
  Dispatcher,
  Clan,
  Pool,
  AICreature,
} from '../engine'
import {
  Protection,
  ProtectionType,
  Damage,
  DamageType,
} from '../engine/models/items'

const newCreature = (
  characteristics: Characteristics,
  name: string,
  protections: Protection[] = [],
  damages: Damage[]
) => {
  return new AICreature(characteristics, new Dispatcher(), {
    name: name,
    weight: 10,
    clan: Clan.PlayerOnlyEnemy,
    abilities: [],
    protections: protections,
    damages: damages,

    maxHealthValue: 1,
    regenerationRate: 5,
    regenerationValue: 1,
  })
}

const rat = () => {
  return newCreature(
    new Characteristics({
      attack: 1,
      defense: 1,
      dexterity: 1,
      radius: 5,
      speed: 90,
    }),
    'Rat',
    [],
    [{ type: DamageType.Melee, dice: { times: 2, max: 2 }, extra: 0 }]
  )
}

const golem = () => {
  return newCreature(
    new Characteristics({
      attack: 1,
      defense: 1,
      dexterity: 1,
      radius: 5,
      speed: 90,
    }),
    'Golem',
    [{ type: ProtectionType.Solid, value: 5 }],
    [{ type: DamageType.Blunt, dice: { times: 1, max: 5 }, extra: 10 }]
  )
}

export const creaturesPool1 = new Pool<null, Creature>([[100, rat], [3, golem]])
