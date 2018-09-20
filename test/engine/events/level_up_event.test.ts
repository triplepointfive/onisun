import { generatePlayer } from '../helpers'
import { Player, LevelUpEvent } from '../../../src/engine'

describe('LevelUpEvent', () => {
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
