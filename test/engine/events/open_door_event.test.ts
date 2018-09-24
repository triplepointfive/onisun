import { generateGame, generateLevelMap, generateCreature } from '../helpers'

import {
  LevelMap,
  Game,
  Door,
  Creature,
  OpenDoorEvent,
} from '../../../src/engine'

describe('OpenDoorEvent', () => {
  let game: Game, levelMap: LevelMap, door: Door, creature: Creature

  beforeEach(() => {
    game = generateGame()
    game.currentMap = levelMap = generateLevelMap()

    door = new Door()

    creature = generateCreature()
  })

  it('opens closed door', () => {
    door.open = false

    creature.on(new OpenDoorEvent(door, levelMap, game))

    expect(game.logger.messages.length).toEqual(1)
    expect(door.open).toBeTruthy()
  })

  it('tries to open open door', () => {
    door.open = true

    creature.on(new OpenDoorEvent(door, levelMap, game))

    expect(game.logger.messages.length).toEqual(1)
    expect(door.open).toBeTruthy()
  })
})
