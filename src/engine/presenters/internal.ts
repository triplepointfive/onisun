import { Player } from '../models/player'
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
  Look,
  Teleportation,
}

export abstract class Presenter {
  public player: Player

  constructor(
    public readonly type: PresenterType,
    protected levelMap: LevelMap,
    protected game: Game
  ) {
    this.player = this.game.player
  }

  public build() {}

  get tile(): Tile {
    return this.levelMap.creatureTile(this.player)
  }

  protected endTurn(): void {
    this.game.player.ai.endTurn()
  }

  protected redirect(presenter: Presenter): void {
    this.game.player.ai.redirect(presenter)
  }
}
