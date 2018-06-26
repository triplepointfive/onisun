import { Pool } from '../src/engine'

it('Weight can not be 0', () => {
  expect(() => new Pool([[0, x => x]])).toThrowError(`Item's weight is lower than 1`)
})

it('Pool is empty', () => {
  expect(() => new Pool([]).pick(2)).toThrowError('Tried to use empty pool')
})

describe('Picks', () => {
  let pool = new Pool([
    [1, x => x * 2],
    [10, x => x + 2],
  ])

  it('Picks and initialize output', () => {
    expect(pool.pick(2)).toEqual(4)
  })
})

describe('merge', () => {
  const p1 = new Pool([[2, x => x]])
  const p2 = new Pool([[1, x => x]])

  expect(p1.merge(p2).pick('x')).toEqual('x')
})
