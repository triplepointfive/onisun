import { drawn, centralize, connectMaps, StairwayDown, StairwayUp, addOnTile } from '../../src/onisun'
import { prettyMap } from '../helpers'

describe('centralize', () => {
  describe('When is already centralized', () => {
    let map = drawn([
      'WWW',
      'WRW',
      'WWW',
    ])

    test('Does nothing', () => {
      centralize(map)
      expect(prettyMap(map)).toEqual(
        ['WWW', 'W W', 'WWW']
      )
    })
  })

  describe('Vertically', () => {
    let map = drawn([
      'WWW',
      'WRW',
      'WWW',
      'WWW',
      'WWW',
    ])

    test('Does nothing', () => {
      centralize(map)
      expect(prettyMap(map)).toEqual(
        ['WWW', 'WWW', 'W W', 'WWW', 'WWW']
      )
    })
  })

  describe('Horizontally', () => {
    let map = drawn([
      'WWWWW',
      'WWWRW',
      'WWWWW',
    ])

    test('Does nothing', () => {
      centralize(map)
      expect(prettyMap(map)).toEqual(
        ['WWWWW', 'WW WW', 'WWWWW']
      )
    })
  })

  describe('Both', () => {
    let map = drawn([
      'WWWWW',
      'WWWWW',
      'WWWWW',
      'WWWRW',
      'WWWWW',
    ])

    test('Does nothing', () => {
        centralize(map)
        expect(prettyMap(map)).toEqual(
        ['WWWWW', 'WWWWW', 'WW WW', 'WWWWW', 'WWWWW']
      )
    })
  })
})

describe('connectMaps', () => {
  let map1 = drawn([ 'R' ])
  let map2 = drawn([ 'R' ])
  connectMaps(map1, map2)

  it('adds downstairs on first map', () => {
    expect(map1.at(0, 0)).toBeInstanceOf(StairwayDown)
  })

  it('adds upstairs on second map', () => {
    expect(map2.at(0, 0)).toBeInstanceOf(StairwayUp)
  })
})

describe('addOnTile', () => {
  let map = drawn([ 'R' ])

  test('Fail when there is no matching tiles', () => {
    expect(() => {
      addOnTile(
        map,
        tile => false,
        (ux, uy) => {
          // Shouldn't get here
        }
      )
    }).toThrowError()
  })
})
