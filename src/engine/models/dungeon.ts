import { withMatchingTile } from '../generator/post'
import { StairwayDown, StairwayUp, Tile } from './tile'
import { LevelMap } from './level_map'
import { Game } from './game'
import { Player } from './player'

export abstract class Dungeon {
  protected levels: LevelMap[] = []

  constructor() {}
  public abstract enter(game: Game, player: Player): void
  public abstract register(game: Game): void

  protected addStairDown(map: LevelMap, adjustMapName: string): LevelMap {
    return this.addStairs(map, new StairwayDown(map, adjustMapName))
  }

  protected addStairUp(map: LevelMap, adjustMapName: string): LevelMap {
    return this.addStairs(map, new StairwayUp(map, adjustMapName))
  }

  private addStairs(map: LevelMap, tile: Tile): LevelMap {
    withMatchingTile(
      map,
      tile => tile.free(),
      (x, y) => {
        map.setTile(x, y, tile)
      }
    )

    return map
  }
}
