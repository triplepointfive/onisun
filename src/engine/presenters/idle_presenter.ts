import { Presenter, PresenterType } from './internal'
import {
  Game,
  Direction,
  DropItemsPresenter,
  DrinkPresenter,
  BagPresenter,
  MissileDialogController,
  HandleController,
  AttackEvent,
  PickUpItemsEvent,
  PickUpPresenter,
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
        return this.move(Direction.right)
      case IdleInputKey.Left:
        return this.move(Direction.left)
      case IdleInputKey.Down:
        return this.move(Direction.down)
      case IdleInputKey.Up:
        return this.move(Direction.up)

      case IdleInputKey.UpRight:
        return this.move(Direction.upRight)
      case IdleInputKey.UpLeft:
        return this.move(Direction.upLeft)
      case IdleInputKey.DownRight:
        return this.move(Direction.downRight)
      case IdleInputKey.DownLeft:
        return this.move(Direction.downLeft)

      case IdleInputKey.Handle:
        return new HandleController(this.game).act()

      case IdleInputKey.PickUp:
        return this.pickUpDialog()
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

  private move(direction: Direction): void {
    const stage = this.player.currentLevel,
      dest = this.player.pos.add(direction),
      tile = stage.at(dest.x, dest.y)

    if (tile.passibleThrough(this.player)) {
      this.player.move(dest)
    } else if (tile.creature) {
      tile.creature.real().on(new AttackEvent(this.player))
    } else {
      this.game.logger.ranIntoAnObstacle()
    }

    this.endTurn()
  }

  private pickUpDialog(): void {
    const tile = this.tile(),
      items = tile.items

    switch ((items && items.bunch.length) || 0) {
      case 0:
        this.game.logger.noItemsToPickUp()
        return
      case 1:
        this.player.on(new PickUpItemsEvent(tile, items.bunch, this.game))
        this.endTurn()
        return
      default:
        this.redirect(new PickUpPresenter(this.game))
        return
    }
  }
}
