import {
  Characteristics,
  Creature,
  Dispatcher,
  Specie,
  Clan,
  Pool,
} from '../engine'

const newCreature = (characteristics: Characteristics, name: string) => {
  return new Creature(
    characteristics,
    new Dispatcher(),
    new Specie(name, 10, Clan.PlayerOnlyEnemy, [])
  )
}

const floatingEye = () => {
  return newCreature(
    new Characteristics({
      attack: 1,
      defense: 1,
      dexterity: 1,
      health: 100,
      radius: 5,
      speed: 200,
    }),
    'Floating eye'
  )
}

const rat = () => {
  return newCreature(
    new Characteristics({
      attack: 1,
      defense: 1,
      dexterity: 1,
      health: 1,
      radius: 5,
      speed: 90,
    }),
    'Rat'
  )
}

const orc = () => {
  return newCreature(
    new Characteristics({
      attack: 3,
      defense: 3,
      dexterity: 2,
      health: 5,
      radius: 5,
      speed: 100,
    }),
    'Orc'
  )
}

const undead = () => {
  return newCreature(
    new Characteristics({
      attack: 2,
      defense: 7,
      dexterity: 1,
      health: 10,
      radius: 5,
      speed: 120,
    }),
    'Undead'
  )
}

const robot = () => {
  return newCreature(
    new Characteristics({
      attack: 5,
      defense: 5,
      dexterity: 3,
      health: 7,
      radius: 7,
      speed: 90,
    }),
    'Robot'
  )
}

const dragon = () => {
  return newCreature(
    new Characteristics({
      attack: 7,
      defense: 7,
      dexterity: 7,
      health: 30,
      radius: 5,
      speed: 100,
    }),
    'Dragon'
  )
}

export const creaturesPool1 = new Pool<null, Creature>([
  [10, rat],
  [1, floatingEye],
])
export const creaturesPool2 = new Pool<null, Creature>([[1, rat], [2, orc]])
export const creaturesPool3 = new Pool<null, Creature>([
  [1, rat],
  [1, orc],
  [2, undead],
])
export const creaturesPool4 = new Pool<null, Creature>([
  [2, undead],
  [2, robot],
])
export const creaturesPool5 = new Pool<null, Creature>([
  [2, robot],
  [1, dragon],
])
