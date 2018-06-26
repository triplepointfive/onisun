import { twoDimArray } from '../utils'
import { LevelMap, Tile } from '../engine'

export default function(drawMap: string[]): LevelMap {
  return new LevelMap(
    twoDimArray(drawMap[0].length, drawMap.length, (x, y) =>
      Tile.retrieve(drawMap[y].charAt(x))
    )
  )
}
