import { Screen, ScreenType } from './internal'
import { Game, Item, AIPickUpItems } from '../engine'
import { IdleScreen } from './idle_screen'
import { GroupedItem } from '../items/internal'

export enum InventoryInputKey {
  Close,
  ItemIndex,
}

interface PickUpScreenPosition {
  item: Item,
  count: number,
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

export class PickUpScreen extends Screen {
  public positions: PickUpScreenPosition[]

  constructor(game: Game) {
    super(ScreenType.Inventory, game)
    this.initPositions()
  }

  protected initPositions(): void {
    const items = this.player.currentLevel.at(
      this.player.pos.x,
      this.player.pos.y
    ).items
    this.positions = items.bunch.map(itemGroup => {
      return { item: itemGroup.item, count: itemGroup.count }
    })
  }

  public pickUpItems(items: GroupedItem[]): void {
    // TODO: Validate items are part of positions
    new AIPickUpItems(items, this.game).act()
  }

  public close(): void {
    this.game.screen = new IdleScreen(this.game)
  }
}
