import { Game } from '../game'
import { Player } from '../creature'
import { LevelMap } from '../level_map';
import { Tile } from '../tile';

export enum PresenterType {
  ProfessionPicking,
  Idle,
  AbilitiesPicking,
  Inventory,
  ItemsListing,
  Missile,
}

export abstract class Presenter {
  public player: Player

  constructor(public readonly type: PresenterType, protected game: Game) {
    this.player = this.game.player
  }

  public build() {}

  protected currentLevel(): LevelMap {
    return this.player.currentLevel
  }

  protected tile(): Tile {
    return this.currentLevel().at(this.player.pos.x, this.player.pos.y)
  }

  protected endTurn(): void {
    this.game.ai.endTurn()
  }

  protected redirect(presenter: Presenter): void {
    this.game.ai.redirect(presenter)
  }
}
