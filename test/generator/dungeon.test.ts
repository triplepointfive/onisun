import { dungeon } from '../../src/onisun'
import { prettyMap } from '../helpers'

it('When exact match', () => {
  let map = dungeon(5, 5, 3, 3, 1)

  expect(prettyMap(map)).toEqual(
    ['WWWWW', 'W   W', 'W   W', 'W   W', 'WWWWW']
  )
})

describe('When there is multiple rooms', () => {
  it('Builds a road between them', () => {
    const map = dungeon(20, 20, 3, 3, 100)
    expect(map.map.some(row => row.some(tile => tile.key === 'C'))).toBeTruthy()
  })
})
