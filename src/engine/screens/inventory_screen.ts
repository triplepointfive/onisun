import { Screen, ScreenType } from './internal'
import {
  Game,
  AITakeOffItem,
  Item,
  InventorySlot,
  GroupedItem,
  PutOnItemsScreen,
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

  constructor(game: Game) {
    super(ScreenType.Inventory, game)

    this.positions = this.player.inventory.slots().map(inventorySlot => {
      return {
        inventorySlot: inventorySlot,
        item: inventorySlot.equipment && inventorySlot.equipment.item,
        count: inventorySlot.equipment && inventorySlot.equipment.count,
        availableItems: inventorySlot.matchingItems(this.player.inventory),
      }
    })
  }

  public takeOff(position: InventoryPosition) {
    new AITakeOffItem(position.inventorySlot, this.game).act()
    this.game.screen = null
  }

  public putOn(position: InventoryPosition) {
    this.game.screen = new PutOnItemsScreen(
      position.inventorySlot,
      position.availableItems,
      this.game
    )
  }

  public close() {
    this.game.screen = new IdleScreen(this.game)
  }
}
