import { drawn, centralize, addOnTile, LevelMap } from '../../src/engine'
import { prettyMap, testTiles } from '../helpers'

describe('centralize', () => {
  describe('When is already centralized', () => {
    let map = new LevelMap(0, drawn(['WWW', 'WRW', 'WWW'], testTiles))

    it('Does nothing', () => {
      centralize(map)
      expect(prettyMap(map)).toEqual(['WWW', 'W W', 'WWW'])
    })
  })

  describe('Vertically', () => {
    let map = new LevelMap(
      0,
      drawn(['WWW', 'WRW', 'WWW', 'WWW', 'WWW'], testTiles)
    )

    it('Does nothing', () => {
      centralize(map)
      expect(prettyMap(map)).toEqual(['WWW', 'WWW', 'W W', 'WWW', 'WWW'])
    })
  })

  describe('Horizontally', () => {
    let map = new LevelMap(0, drawn(['WWWWW', 'WWWRW', 'WWWWW'], testTiles))

    it('Does nothing', () => {
      centralize(map)
      expect(prettyMap(map)).toEqual(['WWWWW', 'WW WW', 'WWWWW'])
    })
  })

  describe('Both', () => {
    let map = new LevelMap(
      0,
      drawn(['WWWWW', 'WWWWW', 'WWWWW', 'WWWRW', 'WWWWW'], testTiles)
    )

    it('Does nothing', () => {
      centralize(map)
      expect(prettyMap(map)).toEqual([
        'WWWWW',
        'WWWWW',
        'WW WW',
        'WWWWW',
        'WWWWW',
      ])
    })
  })
})

// describe('connectMaps', () => {
//   let map1 = drawn(['R'])
//   let map2 = drawn(['R'])
//   connectMaps(map1, map2)
//
//   it('adds downstairs on first map', () => {
//     expect(map1.at(0, 0)).toBeInstanceOf(StairwayDown)
//   })
//
//   it('adds upstairs on second map', () => {
//     expect(map2.at(0, 0)).toBeInstanceOf(StairwayUp)
//   })
// })

describe('addOnTile', () => {
  let map = new LevelMap(0, drawn(['R'], testTiles))

  it('Fail when there is no matching tiles', () => {
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
