import { twoDimArray } from '../utils/utils'

export default function<T>(
  drawMap: string[],
  collection: Map<string, () => T>
): T[][] {
  return twoDimArray(drawMap[0].length, drawMap.length, (x, y) => {
    const tile = collection.get(drawMap[y].charAt(x))
    if (tile) {
      return tile()
    } else {
      throw `drawn: Can not find char ${drawMap[y].charAt(x)}`
    }
  })
}
