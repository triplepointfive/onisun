import { SingleItemUseListingPresenter } from './items_listing_presenter'

export class BagPresenter extends SingleItemUseListingPresenter {
  public readonly title: string = 'Сумка'

  protected initPositions(): void {
    this.positions = this.player.inventory.cares()
  }

  public withItem(): void {
    this.endTurn()
  }
}
