import { DropItemsEvent, Game, GroupedItem, Item, LevelMap } from '../../engine'
import { Potion } from '../models/items'
import { IdlePresenter } from './idle_presenter'
import { Presenter, PresenterType } from './internal'
import { InventoryPresenter } from './inventory_presenter'

export interface ItemsListingPosition {
  item: Item
  count: number
}

export abstract class ItemsListingPresenter extends Presenter {
  // TODO: Pass to constructor
  public positions: ItemsListingPosition[] = []
  public title: string = 'unnamed'

  constructor(levelMap: LevelMap, game: Game) {
    super(PresenterType.ItemsListing, levelMap, game)
    this.initPositions()
  }

  protected abstract initPositions(): void

  public close(): void {
    this.redirect(new IdlePresenter(this.levelMap, this.game))
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
      this.redirect(new IdlePresenter(this.levelMap, this.game))
    }
  }
}

export class PutOnItemsPresenter extends ItemsListingPresenter {
  public title: string = 'Что надеть?'
  public singleItemMode: boolean = true

  constructor(
    private onWithItem: (itemGroup: ItemsListingPosition) => void,
    public positions: ItemsListingPosition[],
    levelMap: LevelMap,
    game: Game
  ) {
    super(levelMap, game)
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
    this.redirect(new InventoryPresenter(this.levelMap, this.game))
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
