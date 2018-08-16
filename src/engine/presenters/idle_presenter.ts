import { Presenter, PresenterType } from './internal'
import {
  Game,
  AIMoveEvent,
  Direction,
  AIPickUpItemsDialog,
  DropItemsPresenter,
  DrinkPresenter,
  BagPresenter,
  AIMissileDialog,
  HandleController,
} from '../../engine'
import { InventoryPresenter } from './inventory_presenter'

export enum IdleInputKey {
  Right,
  Left,
  Down,
  Up,

  UpRight,
  UpLeft,
  DownRight,
  DownLeft,

  Handle,
  Missile,

  Inventory,
  Bag,
  PickUp,
  Drop,
  Drink,
}

export class IdlePresenter extends Presenter {
  constructor(game: Game) {
    super(PresenterType.Idle, game)
  }

  public onInput(key: IdleInputKey) {
    switch (key) {
      case IdleInputKey.Right:
        return new AIMoveEvent(Direction.right, this.game).act()
      case IdleInputKey.Left:
        return new AIMoveEvent(Direction.left, this.game).act()
      case IdleInputKey.Down:
        return new AIMoveEvent(Direction.down, this.game).act()
      case IdleInputKey.Up:
        return new AIMoveEvent(Direction.up, this.game).act()

      case IdleInputKey.UpRight:
        return new AIMoveEvent(Direction.upRight, this.game).act()
      case IdleInputKey.UpLeft:
        return new AIMoveEvent(Direction.upLeft, this.game).act()
      case IdleInputKey.DownRight:
        return new AIMoveEvent(Direction.downRight, this.game).act()
      case IdleInputKey.DownLeft:
        return new AIMoveEvent(Direction.downLeft, this.game).act()

      case IdleInputKey.Handle:
        return new HandleController(this.game).act()

      case IdleInputKey.PickUp:
        return new AIPickUpItemsDialog(this.game).act()
      case IdleInputKey.Missile:
        return new AIMissileDialog(this.game).act()

      case IdleInputKey.Drop:
        this.redirect(new DropItemsPresenter(this.game))
        return
      case IdleInputKey.Drink:
        this.redirect(new DrinkPresenter(this.game))
        return
      case IdleInputKey.Inventory:
        this.redirect(new InventoryPresenter(this.game))
        return
      case IdleInputKey.Bag:
        this.game.screen = new BagPresenter(this.game)
        return
    }
  }
}
