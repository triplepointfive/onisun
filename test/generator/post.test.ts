import { drawn, centralize } from '../../src/onisun'
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
