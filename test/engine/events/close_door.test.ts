import { generateGame, generateLevelMap, generateCreature } from '../helpers'

import {
  LevelMap,
  Game,
  Door,
  Creature,
  CloseDoorEvent,
} from '../../../src/engine'

describe('CloseDoorEvent', () => {
  let game: Game, levelMap: LevelMap, door: Door, creature: Creature

  beforeEach(() => {
    game = generateGame()
    game.currentMap = levelMap = generateLevelMap()

    door = new Door()

    creature = generateCreature()
  })

  it('closes open door', () => {
    door.open = true

    creature.on(new CloseDoorEvent(door, levelMap, game))

    expect(game.logger.messages.length).toEqual(1)
    expect(door.open).toBeFalsy()
  })

  it('tries to close closed door', () => {
    door.open = false

    creature.on(new CloseDoorEvent(door, levelMap, game))

    expect(game.logger.messages.length).toEqual(1)
    expect(door.open).toBeFalsy()
  })
})
