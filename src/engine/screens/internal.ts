import { Game } from '../game'
import { Player } from '../creature'

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
}
