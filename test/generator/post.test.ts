import { drawn, centrize, LevelMap, Tile } from '../../src/onisun'

const tileToChar = function(tile: Tile): string {
  if (tile.isWall()) {
    return 'W'
  } else if (tile.isDoor()) {
    return 'D'
  } else if (tile.isFloor) {
    return ' '
  } else {
    return '?'
  }
}

const prettyMap = function(map: LevelMap): string[] {
  let stringMap = new Array(map.map[0].length).fill('')

  map.map.forEach(column => {
    column.forEach((tile, i) => {
      stringMap[i] += tileToChar(tile)
    })
  })

  return stringMap
}

describe('centrize', () => {
  describe('When is already centrized', () => {
    let map = drawn([
      'WWW',
      'WRW',
      'WWW',
    ])

    test('Does nothing', () => {
      centrize(map)
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
      centrize(map)
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
      centrize(map)
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
      centrize(map)
      expect(prettyMap(map)).toEqual(
        ['WWWWW', 'WWWWW', 'WW WW', 'WWWWW', 'WWWWW']
      )
    })
  })
})
