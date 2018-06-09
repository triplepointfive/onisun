import { Characteristics, PositiveAttribute, Attribute } from '../src/characteristics'

describe('Attribute', () => {
  let attribute: Attribute

  beforeEach(() => {
    attribute = new Attribute(10)
  })

  test('raw', () => {
    expect(attribute.currentValue()).toEqual(10)
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
})