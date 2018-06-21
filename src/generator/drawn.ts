import { twoDimArray } from '../utils'
import { LevelMap, Tile } from '../onisun'

export default function(drawMap: string[]): LevelMap {
  return new LevelMap(
    twoDimArray(drawMap[0].length, drawMap.length, (x, y) =>
      Tile.retrive(drawMap[y].charAt(x))
    )
  )
}
