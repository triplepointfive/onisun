import { Presenter, PresenterType } from './internal'
import {
  Game,
  Item,
  InventorySlot,
  GroupedItem,
  PutOnItemsPresenter,
  PutOnItemEvent,
  TakeOffItemEvent,
} from '../../engine'
import { IdlePresenter } from './idle_presenter'

interface InventoryPosition {
  inventorySlot: InventorySlot
  item: Item | undefined
  count: number | undefined
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
    this.player.on(new TakeOffItemEvent(position.inventorySlot, this.game))
    this.takeTime = true
    this.rebuildPositions()
  }

  public putOn(position: InventoryPosition) {
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
