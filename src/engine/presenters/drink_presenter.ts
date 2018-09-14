import { DrinkPotionEvent, GroupedItem } from '../../engine'
import { ItemGroup, Potion } from '../models/item'
import { SingleItemUseListingPresenter } from './items_listing_presenter'

export class DrinkPresenter extends SingleItemUseListingPresenter {
  public readonly title: string = 'Что выпить?'

  protected initPositions(): void {
    this.positions = this.player.inventory
      .cares()
      .filter(itemGroup => itemGroup.item.group === ItemGroup.Potion)
  }

  public withItem({ item }: GroupedItem<Potion>): void {
    this.player.on(new DrinkPotionEvent(item, this.game))
    this.endTurn()
  }
}
