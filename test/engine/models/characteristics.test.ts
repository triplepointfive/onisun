import { Characteristics } from '../../../src/engine'

describe('Characteristics', () => {
  let characteristics: Characteristics
  const maxHealth: number = 100

  beforeEach(() => {
    characteristics = new Characteristics({
      attack: 10,
      defense: 10,
      dexterity: 0,
      health: maxHealth,
      radius: 10,
      speed: 100,
    })
  })

  describe('regenerate', () => {
    it('health over its maximum', () => {
      characteristics.regenerate()
      expect(characteristics.health.currentValue).toEqual(maxHealth)
    })

    it('health restoration', () => {
      characteristics.health.decrease(50)
      characteristics.regenerate()
      expect(characteristics.health.currentValue).toEqual(51)
    })
  })
})
