import { Presenter, PresenterType } from './internal'
import {
  Game,
  AITakeOffItem,
  Item,
  InventorySlot,
  GroupedItem,
  PutOnItemsPresenter,
  AIPutOnItem,
} from '../../engine'
import { IdlePresenter } from './idle_screen'

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
    new AITakeOffItem(position.inventorySlot, this.game).act()
    this.takeTime = true
    this.rebuildPositions()
  }

  public putOn(position: InventoryPosition) {
    this.game.screen = new PutOnItemsPresenter(
      itemGroup => {
        new AIPutOnItem(position.inventorySlot, itemGroup.item, this.game).act()
        this.takeTime = true
        this.rebuildPositions()
        this.game.screen = this
      },
      position.availableItems,
      this.game
    )
  }

  public close() {
    if (this.takeTime) {
      this.game.screen = null
    } else {
      this.game.screen = new IdlePresenter(this.game)
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
