import {
  drawn,
  centralize,
  withMatchingTile,
  LevelMap,
} from '../../../src/engine'
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

describe('withMatchingTile', () => {
  let map = new LevelMap(0, drawn(['R'], testTiles))

  it('Fail when there is no matching tiles', () => {
    expect(() => {
      withMatchingTile(map, tile => false, (ux, uy) => {})
    }).toThrowError()
  })
})
