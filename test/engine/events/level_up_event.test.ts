import { generateCreature, generatePlayer } from '../helpers'
import { Player, Creature, LevelUpEvent } from '../../../src/engine'

describe('LevelUpEvent', () => {
  it('For creature does nothing', () => {
    let creature: Creature = generateCreature()

    const oldHealth = creature.health.maximum

    creature.on(new LevelUpEvent())

    expect(creature.health.maximum).toEqual(oldHealth)
  })

  describe('For player', () => {
    let player: Player

    beforeEach(() => {
      player = generatePlayer()
    })

    it('decreases health', () => {
      player.constitution.base = 2

      const oldHealth = player.health.maximum

      player.on(new LevelUpEvent())

      expect(player.health.maximum).toEqual(oldHealth - 2)
    })

    it('does not kill with decrease', () => {
      player.constitution.base = 4
      player.health.constantDecrease(player.health.maximum)

      player.on(new LevelUpEvent())

      expect(player.health.maximum).toEqual(1)
      expect(player.health.currentValue).toEqual(1)
    })
  })
})
