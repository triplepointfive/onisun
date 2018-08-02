import { Screen, ScreenType } from './internal'
import { Game, Wearing } from '../engine'
import { IdleScreen } from './idle_screen'

export class InventoryScreen extends Screen {
  public positions: Wearing[] = []

  constructor(game: Game) {
    super(ScreenType.Inventory, game)
    this.positions = this.player.inventory.wears()
  }

  public close() {
    this.game.screen = new IdleScreen(this.game)
  }
}
