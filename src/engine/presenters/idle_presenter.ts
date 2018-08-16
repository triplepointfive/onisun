import { Presenter, PresenterType } from './internal'
import {
  Game,
  MoveController,
  Direction,
  PickUpItemsDialogController,
  DropItemsPresenter,
  DrinkPresenter,
  BagPresenter,
  MissileDialogController,
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
        return new MoveController(Direction.right, this.game).act()
      case IdleInputKey.Left:
        return new MoveController(Direction.left, this.game).act()
      case IdleInputKey.Down:
        return new MoveController(Direction.down, this.game).act()
      case IdleInputKey.Up:
        return new MoveController(Direction.up, this.game).act()

      case IdleInputKey.UpRight:
        return new MoveController(Direction.upRight, this.game).act()
      case IdleInputKey.UpLeft:
        return new MoveController(Direction.upLeft, this.game).act()
      case IdleInputKey.DownRight:
        return new MoveController(Direction.downRight, this.game).act()
      case IdleInputKey.DownLeft:
        return new MoveController(Direction.downLeft, this.game).act()

      case IdleInputKey.Handle:
        return new HandleController(this.game).act()

      case IdleInputKey.PickUp:
        return new PickUpItemsDialogController(this.game).act()
      case IdleInputKey.Missile:
        return new MissileDialogController(this.game).act()

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
        this.redirect(new BagPresenter(this.game))
        return
    }
  }
}
