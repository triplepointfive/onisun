import {
  Characteristics,
  Creature,
  Dispatcher,
  Specie,
  Clan,
  Pool,
  LevelMap,
} from '../engine'
import { Point } from '../engine/utils/utils';

const newCreature = (characteristics: Characteristics, name: string, enterPoint: Point, levelMap: LevelMap) => {
  return new Creature(
    characteristics,
    new Dispatcher(),
    new Specie(name, 10, Clan.PlayerOnlyEnemy, []),
    enterPoint,
    levelMap
  )
}

const floatingEye = ([enterPoint, levelMap]: [Point, LevelMap]) => {
  return newCreature(
    new Characteristics({
      attack: 1,
      defense: 1,
      dexterity: 1,
      health: 100,
      radius: 5,
      speed: 200,
    }),
    'Floating eye',
    enterPoint,
    levelMap
  )
}

const rat = ([enterPoint, levelMap]: [Point, LevelMap]) => {
  return newCreature(
    new Characteristics({
      attack: 1,
      defense: 1,
      dexterity: 1,
      health: 1,
      radius: 5,
      speed: 90,
    }),
    'Rat',
    enterPoint,
    levelMap
  )
}

const orc = ([enterPoint, levelMap]: [Point, LevelMap]) => {
  return newCreature(
    new Characteristics({
      attack: 3,
      defense: 3,
      dexterity: 2,
      health: 5,
      radius: 5,
      speed: 100,
    }),
    'Orc',
    enterPoint,
    levelMap
  )
}

const undead = ([enterPoint, levelMap]: [Point, LevelMap]) => {
  return newCreature(
    new Characteristics({
      attack: 2,
      defense: 7,
      dexterity: 1,
      health: 10,
      radius: 5,
      speed: 120,
    }),
    'Undead',
    enterPoint,
    levelMap
  )
}

const robot = ([enterPoint, levelMap]: [Point, LevelMap]) => {
  return newCreature(
    new Characteristics({
      attack: 5,
      defense: 5,
      dexterity: 3,
      health: 7,
      radius: 7,
      speed: 90,
    }),
    'Robot',
    enterPoint,
    levelMap
  )
}

const dragon = ([enterPoint, levelMap]: [Point, LevelMap]) => {
  return newCreature(
    new Characteristics({
      attack: 7,
      defense: 7,
      dexterity: 7,
      health: 30,
      radius: 5,
      speed: 100,
    }),
    'Dragon',
    enterPoint,
    levelMap
  )
}

export const creaturesPool1 = new Pool<[Point, LevelMap], Creature>([
  [10, rat],
  [1, floatingEye],
])
export const creaturesPool2 = new Pool<[Point, LevelMap], Creature>([[1, rat], [2, orc]])
export const creaturesPool3 = new Pool<[Point, LevelMap], Creature>([
  [1, rat],
  [1, orc],
  [2, undead],
])
export const creaturesPool4 = new Pool<[Point, LevelMap], Creature>([
  [2, undead],
  [2, robot],
])
export const creaturesPool5 = new Pool<[Point, LevelMap], Creature>([
  [2, robot],
  [1, dragon],
])
