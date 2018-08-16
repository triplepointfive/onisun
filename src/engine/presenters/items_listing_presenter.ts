import { Presenter, PresenterType } from './internal'
import {
  Game,
  Item,
  AIPickUpItems,
  AIDropItems,
  AIDrinkItem,
} from '../../engine'
import { IdlePresenter } from './idle_presenter'
import { GroupedItem, ItemGroup, Potion } from '../items/internal'
import { InventoryPresenter } from './inventory_presenter'

interface ItemsListingPosition {
  item: Item
  count: number
}

abstract class ItemsListingPresenter extends Presenter {
  public positions: ItemsListingPosition[]
  public title: string

  constructor(game: Game) {
    super(PresenterType.ItemsListing, game)
    this.initPositions()
  }

  protected abstract initPositions(): void

  public close(): void {
    this.redirect(new IdlePresenter(this.game))
  }
}

export class PickUpPresenter extends ItemsListingPresenter {
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

export class DropItemsPresenter extends ItemsListingPresenter {
  public title: string = 'What to drop?'

  protected initPositions(): void {
    this.positions = this.player.inventory.cares()
  }

  public pickUpItems(items: GroupedItem[]): void {
    // TODO: Validate items are part of positions
    new AIDropItems(items, this.game).act()
  }
}

export class PutOnItemsPresenter extends ItemsListingPresenter {
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
    this.redirect(new InventoryPresenter(this.game))
  }
}

export class DrinkPresenter extends ItemsListingPresenter {
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
    this.endTurn()
  }
}

export class BagPresenter extends ItemsListingPresenter {
  public title: string = 'Сумка'
  public singleItemMode: boolean = true

  protected initPositions(): void {
    this.positions = this.player.inventory.cares()
  }

  public pickUpItems(items: ItemsListingPosition[]): void {
    // TODO: Remove this method or ensure it's not being called
  }

  public withItem(itemGroup: { item: Potion }): void {
    this.endTurn()
  }
}
