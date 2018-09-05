import { withMatchingTile } from '../generator/post'
import { StairwayDown, StairwayUp, Tile } from './tile'
import { LevelMap, LevelMapId } from './level_map'
import { Game } from './game'
import { Player } from './player'

export abstract class Dungeon {
  protected levels: LevelMap[] = []

  constructor() {}
  public abstract enter(game: Game, player: Player): void
  public abstract register(game: Game): void

  protected addStairDown(map: LevelMap, adjustMapId: LevelMapId): LevelMap {
    return this.addStairs(map, new StairwayDown(map, adjustMapId))
  }

  protected addStairUp(map: LevelMap, adjustMapId: LevelMapId): LevelMap {
    return this.addStairs(map, new StairwayUp(map, adjustMapId))
  }

  private addStairs(map: LevelMap, tile: Tile): LevelMap {
    withMatchingTile(
      map,
      tile => tile.isFloor() && tile.passibleThrough(),
      (x, y) => {
        map.setTile(x, y, tile)
      }
    )

    return map
  }
}
