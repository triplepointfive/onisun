import {
  dungeon,
  LevelMap,
  Tile,
  TileTypes,
  Corridor,
  Room,
  Wall,
} from '../../src/engine'
import { prettyMap } from '../helpers'

it('When exact match', () => {
  let map = new LevelMap(
    0,
    dungeon<Tile>(
      5,
      5,
      3,
      3,
      1,
      () => new Room(),
      () => new Corridor('C', TileTypes.Floor),
      () => new Wall()
    )
  )

  expect(prettyMap(map)).toEqual(['WWWWW', 'W   W', 'W   W', 'W   W', 'WWWWW'])
})

describe('When there is multiple rooms', () => {
  it('Builds a road between them', () => {
    const map = new LevelMap(
      0,
      dungeon<Tile>(
        20,
        20,
        3,
        3,
        100,
        () => new Room(),
        () => new Corridor('C', TileTypes.Floor),
        () => new Wall()
      )
    )
    expect(map.map.some(row => row.some(tile => tile.key === 'C'))).toBeTruthy()
  })
})
