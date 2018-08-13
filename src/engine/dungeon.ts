import { LevelMap } from './level_map'
import { Game } from './game'

export abstract class Dungeon {
  protected levels: LevelMap[] = []

  constructor(
    protected game: Game,
  ) {

  }

  public build(): void {
    return

  }
}
