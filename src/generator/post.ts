import { LevelMap, Tile, TileTypes } from '../map'

export const addDoors = function (
  level: LevelMap,
  addDoor: () => boolean = () => true,
  ): LevelMap {
  for (let j = 1; j < level.height - 1; j++) {

    for (let i = 1; i < level.width; i++) {
      const
        tile  = level.at(i, j),
        up    = level.at(i, j - 1),
        down  = level.at(i, j + 1),
        left  = level.at(i - 1, j),
        right = level.at(i + 1, j)

      if (!addDoor() || tile.key !== 'C') {
        continue
      }

      if (left.key === 'D' || right.key === 'D' || up.key === 'D' || down.key === 'D') {
        continue
      }

      if (left.key !== 'R' && right.key !== 'R' && up.key !== 'R' && down.key !== 'R') {
        continue
      }

      if ((left.key === 'W' && right.key === 'W') || (up.key === 'W' && down.key === 'W')) {
        level.setTile(i, j, Tile.retrive('D'))
      }
    }
  }

  return level
}
