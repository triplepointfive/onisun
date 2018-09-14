import { GroupedItem } from '../lib/bunch'
import { SingleItemUseListingPresenter } from './items_listing_presenter'
import { Item } from '../models/item'
import { LevelMap } from '../models/level_map'
import { Game } from '../models/game'
import { InventoryPresenter } from './inventory_presenter'

export class PutOnItemsPresenter extends SingleItemUseListingPresenter {
  public readonly title: string = 'Что надеть?'

  constructor(
    private onWithItem: (itemGroup: GroupedItem<Item>) => void,
    public positions: GroupedItem<Item>[],
    levelMap: LevelMap,
    game: Game
  ) {
    super(levelMap, game)
  }

  protected initPositions(): void {}

  public withItem(itemGroup: GroupedItem<Item>): void {
    this.onWithItem(itemGroup)
  }

  public close(): void {
    this.redirect(new InventoryPresenter(this.levelMap, this.game))
  }
}
