import { Player } from '../models/creature'
import { LevelMap } from '../models/level_map'
import { Tile } from '../models/tile'
import { Game } from '../../engine'

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
    this.game.player.ai.endTurn()
  }

  protected redirect(presenter: Presenter): void {
    this.game.player.ai.redirect(presenter)
  }
}
