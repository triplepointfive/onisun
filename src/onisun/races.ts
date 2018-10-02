import { Race } from '../engine'

export const humanRace: Race = {
  name: 'human',
  primaryAttributes: {
    strength: 8,
    dexterity: 8,
    constitution: 7,
    intelligence: 7,
    wisdom: 6,
    charisma: 9,
  },
  experienceRatio: 0.9,
}

export const dwarfRace: Race = {
  name: 'human',
  primaryAttributes: {
    strength: 10,
    dexterity: 7,
    constitution: 9,
    intelligence: 5,
    wisdom: 7,
    charisma: 7,
  },
  experienceRatio: 1,
}

export const allRaces: Race[] = [humanRace, dwarfRace]
