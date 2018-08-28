import { PositiveAttribute, Attribute } from '../../../src/engine'

describe('Attribute', () => {
  let attribute: Attribute

  beforeEach(() => {
    attribute = new Attribute(10)
  })

  it('raw', () => {
    expect(attribute.currentValue).toEqual(10)
    expect(attribute.atMax).toBeTruthy()
  })

  it('increase over maximum does nothing', () => {
    attribute.increase(2)
    expect(attribute.currentValue).toEqual(10)
    expect(attribute.maximum).toEqual(10)
  })

  it('decreased', () => {
    attribute.decrease(2)
    expect(attribute.currentValue).toEqual(8)
    expect(attribute.maximum).toEqual(10)
    expect(attribute.atMax).toBeFalsy()
  })

  it('increase when decreased', () => {
    attribute.decrease(4)
    expect(attribute.currentValue).toEqual(6)
    attribute.increase(2)
    expect(attribute.currentValue).toEqual(8)
    expect(attribute.maximum).toEqual(10)
  })

  it('decreased below 0', () => {
    attribute.decrease(12)
    expect(attribute.currentValue).toEqual(-2)
    expect(attribute.maximum).toEqual(10)
  })

  it('increased with maximum', () => {
    attribute.constantIncrease(2)
    expect(attribute.currentValue).toEqual(12)
    expect(attribute.maximum).toEqual(12)
  })

  it('decreased with maximum', () => {
    attribute.constantDecrease(2)
    expect(attribute.currentValue).toEqual(8)
    expect(attribute.maximum).toEqual(8)
  })

  it('increase with maximum when decreased', () => {
    attribute.decrease(5)
    attribute.constantIncrease(3)
    expect(attribute.currentValue).toEqual(8)
    expect(attribute.maximum).toEqual(13)
  })

  it('modifier increases over maximum', () => {
    attribute.addModifier(5)
    expect(attribute.currentValue).toEqual(15)
    attribute.removeModifier(5)
    expect(attribute.currentValue).toEqual(10)
  })
})

describe('PositiveAttribute', () => {
  let attribute: PositiveAttribute

  beforeEach(() => {
    attribute = new PositiveAttribute(10)
  })

  it('raw', () => {
    expect(attribute.currentValue).toEqual(10)
    expect(attribute.atMax).toBeTruthy()
  })

  it('increase over maximum does nothing', () => {
    attribute.increase(2)
    expect(attribute.currentValue).toEqual(10)
    expect(attribute.maximum).toEqual(10)
  })

  it('decreased', () => {
    attribute.decrease(2)
    expect(attribute.currentValue).toEqual(8)
    expect(attribute.maximum).toEqual(10)
    expect(attribute.atMax).toBeFalsy()
  })

  it('increase when decreased', () => {
    attribute.decrease(4)
    expect(attribute.currentValue).toEqual(6)
    attribute.increase(2)
    expect(attribute.currentValue).toEqual(8)
    expect(attribute.maximum).toEqual(10)
  })

  it('never decreases below 0', () => {
    attribute.decrease(12)
    expect(attribute.currentValue).toEqual(1)
    expect(attribute.maximum).toEqual(10)
  })

  it('increased with maximum', () => {
    attribute.constantIncrease(2)
    expect(attribute.currentValue).toEqual(12)
    expect(attribute.maximum).toEqual(12)
  })

  it('decreased with maximum', () => {
    attribute.constantDecrease(2)
    expect(attribute.currentValue).toEqual(8)
    expect(attribute.maximum).toEqual(8)
  })

  it('decreased with maximum below 0', () => {
    attribute.constantDecrease(12)
    expect(attribute.currentValue).toEqual(1)
    expect(attribute.maximum).toEqual(1)
    attribute.addModifier(-5)
    expect(attribute.currentValue).toEqual(1)
  })

  it('increase with maximum when decreased', () => {
    attribute.decrease(5)
    attribute.constantIncrease(3)
    expect(attribute.currentValue).toEqual(8)
    expect(attribute.maximum).toEqual(13)
  })

  it('modifier increases over maximum', () => {
    attribute.addModifier(5)
    expect(attribute.currentValue).toEqual(15)
    attribute.removeModifier(5)
    expect(attribute.currentValue).toEqual(10)
  })
})
