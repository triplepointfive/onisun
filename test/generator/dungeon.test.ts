import { dungeon, LevelMap, Tile, TileTypes } from '../../src/engine'
import { prettyMap } from '../helpers'

it('When exact match', () => {
  let map = new LevelMap(0, dungeon(5, 5, 3, 3, 1,
      () => new Tile('R', ' ', TileTypes.Floor),
      () => new Tile('C', ' ', TileTypes.Floor),
      () => new Tile('W', '#', TileTypes.Wall),
))

  expect(prettyMap(map)).toEqual(['WWWWW', 'W   W', 'W   W', 'W   W', 'WWWWW'])
})

describe('When there is multiple rooms', () => {
  it('Builds a road between them', () => {
    const map = new LevelMap(0, dungeon(20, 20, 3, 3, 100,
      () => new Tile('R', ' ', TileTypes.Floor),
      () => new Tile('C', ' ', TileTypes.Floor),
      () => new Tile('W', '#', TileTypes.Wall),
    ))
    expect(map.map.some(row => row.some(tile => tile.key === 'C'))).toBeTruthy()
  })
})
