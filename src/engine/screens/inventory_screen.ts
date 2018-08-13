import { Screen, ScreenType } from './internal'
import {
  Game,
  AITakeOffItem,
  Item,
  InventorySlot,
  GroupedItem,
  PutOnItemsScreen,
  AIPutOnItem,
} from '../../engine'
import { IdleScreen } from './idle_screen'

interface InventoryPosition {
  inventorySlot: InventorySlot
  item: Item
  count: number
  availableItems: GroupedItem[]
}

export class InventoryScreen extends Screen {
  public positions: InventoryPosition[] = []
  private takeTime: boolean = false

  constructor(game: Game) {
    super(ScreenType.Inventory, game)
    this.rebuildPositions()
  }

  public takeOff(position: InventoryPosition) {
    new AITakeOffItem(position.inventorySlot, this.game).act()
    this.takeTime = true
    this.rebuildPositions()
  }

  public putOn(position: InventoryPosition) {
    this.game.screen = new PutOnItemsScreen(
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
      this.game.screen = new IdleScreen(this.game)
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
