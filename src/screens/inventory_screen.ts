import { Screen, ScreenType } from './internal'
import { Game } from '../engine'
import { IdleScreen } from './idle_screen'

export enum InventoryInputKey {
  Close,
  ItemIndex,
}

export class InventoryScreen extends Screen {
  constructor(game: Game) {
    super(ScreenType.Inventory, game)
    this.initPositions()
  }

  public onInput(key: InventoryInputKey) {
    switch (key) {
      case InventoryInputKey.Close:
        return (this.game.screen = new IdleScreen(this.game))
    }
  }

  protected initPositions(): void {}
}
