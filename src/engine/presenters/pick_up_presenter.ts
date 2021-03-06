import {
  Item,
  PickUpItemsEvent,
  MultipleItemUseListingPresenter,
} from '../../engine'
import { GroupedItem } from '../lib/bunch'

export class PickUpPresenter extends MultipleItemUseListingPresenter {
  public readonly title: string = 'Что поднять?'

  protected initPositions(): void {
    const items = this.tile.items

    if (items === undefined) {
      throw `Failed to show pick up dialog - tile has no items`
    }

    this.positions = items.bunch.map(itemGroup => {
      return { item: itemGroup.item, count: itemGroup.count }
    })
  }

  public withItems(items: GroupedItem<Item>[]): void {
    // TODO: Validate items are part of positions
    this.player.on(new PickUpItemsEvent(this.tile, items, this.game))
    this.endTurn()
  }
}
