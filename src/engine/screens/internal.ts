import { Game } from '../game'
import { Player } from '../creature'

export enum ScreenType {
  ProfessionPicking,
  Idle,
  AbilitiesPicking,
  Inventory,
  ItemsListing,
}

export abstract class Screen {
  public player: Player

  constructor(public readonly type: ScreenType, protected game: Game) {
    this.player = this.game.player
  }

  public build() {}
}
