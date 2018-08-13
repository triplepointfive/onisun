import { Screen, ScreenType } from './internal'
import {
  Game,
  Item,
  AIPickUpItems,
  AIDropItems,
  AIDrinkItem,
} from '../../engine'
import { IdleScreen } from './idle_screen'
import { GroupedItem, ItemGroup, Potion } from '../items/internal'
import { InventoryScreen } from './inventory_screen'

interface ItemsListingPosition {
  item: Item
  count: number
}

abstract class ItemsListingScreen extends Screen {
  public positions: ItemsListingPosition[]
  public title: string

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
  public title: string = 'What to pick up?'

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
  public title: string = 'What to drop?'

  protected initPositions(): void {
    this.positions = this.player.inventory.cares()
  }

  public pickUpItems(items: GroupedItem[]): void {
    // TODO: Validate items are part of positions
    new AIDropItems(items, this.game).act()
  }
}

export class PutOnItemsScreen extends ItemsListingScreen {
  public title: string = 'What to put on?'
  public singleItemMode: boolean = true

  constructor(
    private onWithItem: (itemGroup: ItemsListingPosition) => void,
    public positions: ItemsListingPosition[],
    game: Game
  ) {
    super(game)
  }

  protected initPositions(): void {}

  public pickUpItems(items: ItemsListingPosition[]): void {
    // TODO: Validate items are part of positions
    // new AIDropItems(items, this.game).act()
  }

  public withItem(itemGroup: ItemsListingPosition): void {
    this.onWithItem(itemGroup)
  }

  public close(): void {
    this.game.screen = new InventoryScreen(this.game)
  }
}

export class DrinkScreen extends ItemsListingScreen {
  public title: string = 'Что выпить?'
  public singleItemMode: boolean = true

  protected initPositions(): void {
    this.positions = this.player.inventory
      .cares()
      .filter(itemGroup => itemGroup.item.group === ItemGroup.Potion)
  }

  public pickUpItems(items: ItemsListingPosition[]): void {
    // TODO: Remove this method or ensure it's not being called
  }

  public withItem(itemGroup: { item: Potion }): void {
    new AIDrinkItem(itemGroup.item, this.game).act()
    this.game.screen = undefined
  }
}

export class BagScreen extends ItemsListingScreen {
  public title: string = 'Сумка'
  public singleItemMode: boolean = true

  protected initPositions(): void {
    this.positions = this.player.inventory.cares()
  }

  public pickUpItems(items: ItemsListingPosition[]): void {
    // TODO: Remove this method or ensure it's not being called
  }

  public withItem(itemGroup: { item: Potion }): void {
    this.game.screen = undefined
  }
}
