import { Presenter, PresenterType } from './internal'
import {
  Game,
  Item,
  PickUpItemsEvent,
  DrinkPotionEvent,
  DropItemsEvent,
  GroupedItem,
} from '../../engine'
import { IdlePresenter } from './idle_presenter'
import { ItemGroup, Potion } from '../models/items'
import { InventoryPresenter } from './inventory_presenter'

interface ItemsListingPosition {
  item: Item
  count: number
}

abstract class ItemsListingPresenter extends Presenter {
  // TODO: Pass to constructor
  public positions: ItemsListingPosition[] = []
  public title: string = 'unnamed'

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
  public title: string = 'Что поднять?'

  protected initPositions(): void {
    const items = this.tile.items

    if (items === undefined) {
      throw `Failed to show pick up dialog - tile has no items`
    }

    this.positions = items.bunch.map(itemGroup => {
      return { item: itemGroup.item, count: itemGroup.count }
    })
  }

  public pickUpItems(items: GroupedItem<Item>[]): void {
    // TODO: Validate items are part of positions
    this.player.on(new PickUpItemsEvent(this.tile, items, this.game))
    this.endTurn()
  }
}

export class DropItemsPresenter extends ItemsListingPresenter {
  public title: string = 'Что положить?'

  protected initPositions(): void {
    this.positions = this.player.inventory.cares()
  }

  public pickUpItems(items: GroupedItem<Item>[]): void {
    if (items.length) {
      this.player.on(new DropItemsEvent(this.tile, items, this.game))
      this.endTurn()
    } else {
      this.redirect(new IdlePresenter(this.game))
    }
  }
}

export class PutOnItemsPresenter extends ItemsListingPresenter {
  public title: string = 'Что надеть?'
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
    this.player.on(new DrinkPotionEvent(itemGroup.item, this.game))
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
