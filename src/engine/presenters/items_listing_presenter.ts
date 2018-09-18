import { Game, GroupedItem, Item, LevelMap } from '../../engine'
import { Presenter, PresenterType } from './internal'

export abstract class ItemsListingPresenter extends Presenter {
  public positions: GroupedItem<Item>[] = []

  constructor(levelMap: LevelMap, game: Game) {
    super(levelMap, game)
    this.initPositions()
  }

  get type(): PresenterType {
    return PresenterType.ItemsListing
  }

  abstract get title(): string
  abstract get singleItemMode(): boolean

  protected abstract initPositions(): void

  public close(): void {
    this.goIdle()
  }
}

export abstract class SingleItemUseListingPresenter extends ItemsListingPresenter {
  get singleItemMode(): boolean {
    return true
  }

  public abstract withItem(items: GroupedItem<Item>): void
}

export abstract class MultipleItemUseListingPresenter extends ItemsListingPresenter {
  get singleItemMode(): boolean {
    return false
  }

  public abstract withItems(items: GroupedItem<Item>[]): void
}
