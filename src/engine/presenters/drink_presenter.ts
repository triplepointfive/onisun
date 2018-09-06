import {
  ItemsListingPresenter,
  ItemsListingPosition,
} from './items_listing_presenter'
import { ItemGroup, Potion } from '../models/items'
import { DrinkPotionEvent } from '../../engine'

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
