import { Characteristics, PositiveAttribute, Attribute } from '../src/characteristics'

describe('Attribute', () => {
  let attribute: Attribute

  beforeEach(() => {
    attribute = new Attribute(10)
  })

  test('raw', () => {
    expect(attribute.currentValue()).toEqual(10)
    expect(attribute.atMax()).toBeTruthy
  })

  test('increase over maximum does nothing', () => {
    attribute.increase(2)
    expect(attribute.currentValue()).toEqual(10)
    expect(attribute.maximum()).toEqual(10)
  })

  test('decreased', () => {
    attribute.decrease(2)
    expect(attribute.currentValue()).toEqual(8)
    expect(attribute.maximum()).toEqual(10)
    expect(attribute.atMax()).toBeFalsy
  })

  test('increase when decreased', () => {
    attribute.decrease(4)
    expect(attribute.currentValue()).toEqual(6)
    attribute.increase(2)
    expect(attribute.currentValue()).toEqual(8)
    expect(attribute.maximum()).toEqual(10)
  })

  test('decreased below 0', () => {
    attribute.decrease(12)
    expect(attribute.currentValue()).toEqual(-2)
    expect(attribute.maximum()).toEqual(10)
  })

  test('increased with maximum', () => {
    attribute.constantIncrease(2)
    expect(attribute.currentValue()).toEqual(12)
    expect(attribute.maximum()).toEqual(12)
  })

  test('decreased with maximum', () => {
    attribute.constantDecrease(2)
    expect(attribute.currentValue()).toEqual(8)
    expect(attribute.maximum()).toEqual(8)
  })

  test('increase with maximum when decreased', () => {
    attribute.decrease(5)
    attribute.constantIncrease(3)
    expect(attribute.currentValue()).toEqual(8)
    expect(attribute.maximum()).toEqual(13)
  })

  test('modifier increases over maximum', () => {
    attribute.addModifier(5)
    expect(attribute.currentValue()).toEqual(15)
    attribute.removeModifier(5)
    expect(attribute.currentValue()).toEqual(10)
  })
})

describe('PositiveAttribute', () => {
  let attribute: PositiveAttribute

  beforeEach(() => {
    attribute = new PositiveAttribute(10)
  })

  test('raw', () => {
    expect(attribute.currentValue()).toEqual(10)
    expect(attribute.atMax()).toBeTruthy
  })

  test('increase over maximum does nothing', () => {
    attribute.increase(2)
    expect(attribute.currentValue()).toEqual(10)
    expect(attribute.maximum()).toEqual(10)
  })

  test('decreased', () => {
    attribute.decrease(2)
    expect(attribute.currentValue()).toEqual(8)
    expect(attribute.maximum()).toEqual(10)
    expect(attribute.atMax()).toBeFalsy
  })

  test('increase when decreased', () => {
    attribute.decrease(4)
    expect(attribute.currentValue()).toEqual(6)
    attribute.increase(2)
    expect(attribute.currentValue()).toEqual(8)
    expect(attribute.maximum()).toEqual(10)
  })

  test('never decreases below 0', () => {
    attribute.decrease(12)
    expect(attribute.currentValue()).toEqual(1)
    expect(attribute.maximum()).toEqual(10)
  })

  test('increased with maximum', () => {
    attribute.constantIncrease(2)
    expect(attribute.currentValue()).toEqual(12)
    expect(attribute.maximum()).toEqual(12)
  })

  test('decreased with maximum', () => {
    attribute.constantDecrease(2)
    expect(attribute.currentValue()).toEqual(8)
    expect(attribute.maximum()).toEqual(8)
  })

  test('decreased with maximum below 0', () => {
    attribute.constantDecrease(12)
    expect(attribute.currentValue()).toEqual(1)
    expect(attribute.maximum()).toEqual(1)
    attribute.addModifier(-5)
    expect(attribute.currentValue()).toEqual(1)
  })

  test('increase with maximum when decreased', () => {
    attribute.decrease(5)
    attribute.constantIncrease(3)
    expect(attribute.currentValue()).toEqual(8)
    expect(attribute.maximum()).toEqual(13)
  })

  test('modifier increases over maximum', () => {
    attribute.addModifier(5)
    expect(attribute.currentValue()).toEqual(15)
    attribute.removeModifier(5)
    expect(attribute.currentValue()).toEqual(10)
  })
})

describe('Characteristics', () => {
  let characteristics: Characteristics
  const maxHealth: number = 100

  beforeEach(() => {
    characteristics = new Characteristics(
      10,
      10,
      maxHealth,
      10,
      100,
    )
  })

  it('damageTo', () => {
    const opponent = new Characteristics(
      10,
      1,
      maxHealth,
      10,
      100,
    )

    expect(characteristics.damageTo(opponent)).toBeGreaterThan(0)
  })

  describe('regenerate', () => {
    test('health over its maximum', () => {
      characteristics.regenerate()
      expect(characteristics.health.currentValue()).toEqual(maxHealth)
    })

    test('health restoration', () => {
      characteristics.health.decrease(50)
      characteristics.regenerate()
      expect(characteristics.health.currentValue()).toEqual(55)
    })
  })
})
