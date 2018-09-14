import { MultipleItemUseListingPresenter } from './items_listing_presenter'
import { GroupedItem } from '../lib/bunch'
import { Item } from '../models/item'
import { DropItemsEvent } from '../events/drop_items_event'

export class DropItemsPresenter extends MultipleItemUseListingPresenter {
  public readonly title: string = 'Что положить?'

  protected initPositions(): void {
    this.positions = this.player.inventory.cares()
  }

  public withItems(items: GroupedItem<Item>[]): void {
    if (items.length) {
      this.player.on(new DropItemsEvent(this.tile, items, this.game))
      this.endTurn()
    } else {
      this.goIdle()
    }
  }
}
