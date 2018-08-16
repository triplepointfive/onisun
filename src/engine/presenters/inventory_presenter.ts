import { Presenter, PresenterType } from './internal'
import {
  Game,
  TakeOffItemController,
  Item,
  InventorySlot,
  GroupedItem,
  PutOnItemsPresenter,
  PutOnItemController,
} from '../../engine'
import { IdlePresenter } from './idle_presenter'

interface InventoryPosition {
  inventorySlot: InventorySlot
  item: Item
  count: number
  availableItems: GroupedItem[]
}

export class InventoryPresenter extends Presenter {
  public positions: InventoryPosition[] = []
  private takeTime: boolean = false

  constructor(game: Game) {
    super(PresenterType.Inventory, game)
    this.rebuildPositions()
  }

  public takeOff(position: InventoryPosition) {
    new TakeOffItemController(position.inventorySlot, this.game).act()
    this.takeTime = true
    this.rebuildPositions()
  }

  public putOn(position: InventoryPosition) {
    this.redirect(
      new PutOnItemsPresenter(
        itemGroup => {
          new PutOnItemController(
            position.inventorySlot,
            itemGroup.item,
            this.game
          ).act()
          this.takeTime = true
          this.rebuildPositions()
          this.redirect(this)
        },
        position.availableItems,
        this.game
      )
    )
  }

  public close() {
    if (this.takeTime) {
      this.endTurn()
    } else {
      this.redirect(new IdlePresenter(this.game))
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
