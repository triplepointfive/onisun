import { Screen, ScreenType } from './internal'
import { Game } from 'src/engine'
import { IdleScreen } from './idle_screen'

export enum InventoryInputKey {
  Close,
  ItemIndex,
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
  protected initPositions(): void {
    const items = this.player.currentLevel.at(this.player.pos.x, this.player.pos.y).items
    this.positions = items.bunch.map(itemGroup => itemGroup.item.name)
  }

  public onInput(key: InventoryInputKey, itemIndex: number = 0) {
    switch (key) {
    case InventoryInputKey.Close:
      return this.game.screen = new IdleScreen(this.game)
    case InventoryInputKey.ItemIndex:
    }
  }
}
