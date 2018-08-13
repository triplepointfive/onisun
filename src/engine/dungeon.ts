import { LevelMap, LevelMapId } from './level_map'
import { Game } from './game'
import { addOnTile } from './generator/post'
import { StairwayDown, StairwayUp, Tile } from './tile'

export abstract class Dungeon {
  protected levels: LevelMap[] = []

  constructor(protected game: Game) {}
  public abstract build(): void
  public abstract enter(): void

  protected addStairDown(map: LevelMap, adjustMapId: LevelMapId): LevelMap {
    return this.addStairs(map, new StairwayDown(map, adjustMapId))
  }

  protected addStairUp(map: LevelMap, adjustMapId: LevelMapId): LevelMap {
    return this.addStairs(map, new StairwayUp(map, adjustMapId))
  }

  private addStairs(map: LevelMap, tile: Tile): LevelMap {
    addOnTile(
      map,
      tile => tile.isFloor() && tile.passibleThrough(),
      (x, y) => {
        map.setTile(x, y, tile)
      }
    )

    return map
  }
}
