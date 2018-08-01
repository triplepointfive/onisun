import { Screen, ScreenType } from './internal'
import { Game, Item, AIPickUpItems, AIDropItems } from '../engine'
import { IdleScreen } from './idle_screen'
import { GroupedItem } from '../items/internal'

interface ItemsListingPosition {
  item: Item,
  count: number,
}

abstract class ItemsListingScreen extends Screen {
  public positions: ItemsListingPosition[]

  constructor(game: Game) {
    super(ScreenType.ItemsListing, game)
    this.initPositions()
  }

  protected abstract initPositions()

  public close(): void {
    this.game.screen = new IdleScreen(this.game)
  }
}

export class PickUpScreen extends ItemsListingScreen {
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
}

export class DropItemsScreen extends ItemsListingScreen {
  protected initPositions(): void {
    this.positions = this.player.inventory.cares()
  }

  public pickUpItems(items: GroupedItem[]): void {
    // TODO: Validate items are part of positions
    new AIDropItems(items, this.game).act()
  }
}
