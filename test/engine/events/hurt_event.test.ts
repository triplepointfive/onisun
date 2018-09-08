import {
  Creature,
  DamageType,
  HurtEvent,
  LevelMap,
  Point,
  DieReason,
  DieEvent,
} from '../../../src/engine'
import { generateCreature, generateGame, generateLevelMap } from '../helpers'

describe('HurtEvent', () => {
  let creature: Creature, game, event, map: LevelMap

  beforeEach(() => {
    game = generateGame()
    game.currentMap = map = generateLevelMap()
    creature = generateCreature()
    map.addCreature(new Point(1, 1), creature)

    jest.spyOn(creature, 'on')

    event = new HurtEvent(
      [{ type: DamageType.Pure, dice: { times: 0, max: 0 }, extra: 10 }],
      DieReason.Attack,
      map,
      game
    )
  })

  it('does damage', () => {
    expect(creature.health.atMax).toBeTruthy()
    creature.on(event)
    expect(creature.health.atMax).toBeFalsy()
  })

  it('may even kill', () => {
    creature.health.decrease(creature.health.maximum - 1)
    creature.on(event)

    expect(creature.on).toHaveBeenCalledTimes(2)
    expect(creature.on.mock.calls[1][0]).toBeInstanceOf(DieEvent)
  })
})
