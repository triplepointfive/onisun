import { Screen, ScreenType } from './internal'
import { Game } from 'src/engine'
import { IdleScreen } from './idle_screen'

export enum InventoryInputKey {
  Close
}

export class InventoryScreen extends Screen {
  public positions: string[]

  constructor(game: Game) {
    super(ScreenType.Inventory, game)
    this.initPositions()
  }

  public onInput(key: InventoryInputKey) {
    switch (key) {
      case InventoryInputKey.Close:
        return this.game.screen = new IdleScreen(this.game)
    }
  }

  protected initPositions(): void {

  }
}

export class PickUpScreen extends InventoryScreen {
  // protected initPositions(): void {
    // this.positions = items.bunch.map(itemGroup => itemGroup.item.name)
  // }
}
