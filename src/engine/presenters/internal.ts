import { Player } from '../models/creature'
import { LevelMap } from '../models/level_map'
import { Tile } from '../models/tile'
import { Game } from '../../engine'

export enum PresenterType {
  AbilitiesPicking,
  Death,
  Idle,
  Inventory,
  ItemsListing,
  Missile,
  ProfessionPicking,
}

export abstract class Presenter {
  public player: Player

  constructor(public readonly type: PresenterType, protected game: Game) {
    this.player = this.game.player
  }

  public build() {}

  get currentLevel(): LevelMap {
    return this.game.currentMap
  }

  get tile(): Tile {
    return this.currentLevel.creatureTile(this.player)
  }

  protected endTurn(): void {
    this.game.player.ai.endTurn()
  }

  protected redirect(presenter: Presenter): void {
    this.game.player.ai.redirect(presenter)
  }
}
