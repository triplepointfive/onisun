import { twoDimArray } from '../utils/utils'

export default function<T>(
  drawMap: string[],
  collection: Map<string, () => T>
): T[][] {
  return twoDimArray(drawMap[0].length, drawMap.length, (x, y) =>
    collection.get(drawMap[y].charAt(x))()
  )
}
