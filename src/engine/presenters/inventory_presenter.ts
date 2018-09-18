import { Presenter, PresenterType } from './internal'
import {
  Game,
  Item,
  InventorySlot,
  GroupedItem,
  PutOnItemsPresenter,
  PutOnItemEvent,
  TakeOffItemEvent,
  LevelMap,
} from '../../engine'
import { IdlePresenter } from './idle_presenter'

export interface InventoryPresenterPosition {
  inventorySlot: InventorySlot
  item?: Item
  count?: number
  availableItems: GroupedItem<Item>[]
}

export class InventoryPresenter extends Presenter {
  public positions: InventoryPresenterPosition[] = []
  private takeTime: boolean = false

  constructor(levelMap: LevelMap, game: Game) {
    super(levelMap, game)
    this.rebuildPositions()
  }

  get type(): PresenterType {
    return PresenterType.Inventory
  }

  public takeOff(position: InventoryPresenterPosition) {
    this.player.on(new TakeOffItemEvent(position.inventorySlot, this.game))
    this.takeTime = true
    this.rebuildPositions()
  }

  public putOn(position: InventoryPresenterPosition) {
    this.redirect(
      new PutOnItemsPresenter(
        itemGroup => {
          this.player.on(
            new PutOnItemEvent(
              position.inventorySlot,
              itemGroup.item,
              this.game
            )
          )

          this.takeTime = true
          this.rebuildPositions()
          this.redirect(this)
        },
        position.availableItems,
        this.levelMap,
        this.game
      )
    )
  }

  public close() {
    if (this.takeTime) {
      this.endTurn()
    } else {
      this.redirect(new IdlePresenter(this.levelMap, this.game))
    }
  }

  private rebuildPositions(): void {
    this.positions = this.player.inventory.slots().map(inventorySlot => {
      return {
        inventorySlot: inventorySlot,
        item: inventorySlot.equipment && inventorySlot.equipment.item,
        count: inventorySlot.equipment && inventorySlot.equipment.count,
        availableItems: inventorySlot.matchingItems(this.player.inventory),
      }
    })
  }
}
