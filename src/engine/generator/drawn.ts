import { twoDimArray } from '../utils'
import { Tile } from '../../engine'

export default function(drawMap: string[]): Tile[][] {
  return twoDimArray(drawMap[0].length, drawMap.length, (x, y) =>
      Tile.retrieve(drawMap[y].charAt(x))
    )
}
