import { Screen, ScreenType } from './internal'
import { Game, AIMoveEvent, Direction, AIHandleEnvEvent } from 'src/engine'
import { InventoryScreen, PickUpScreen } from './inventory_screen';

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

  Inventory,
  PickUp,
}

export class IdleScreen extends Screen {
  constructor(game: Game) {
    super(ScreenType.Idle, game)
  }

  public onInput(key: IdleInputKey) {
    // TODO: Shouldn't be done here, move to every command
    this.game.screen = undefined

    switch (key) {
    case IdleInputKey.Right:
      return new AIMoveEvent(Direction.right).act(this.game.player)
    case IdleInputKey.Left:
      return new AIMoveEvent(Direction.left).act(this.game.player)
    case IdleInputKey.Down:
      return new AIMoveEvent(Direction.down).act(this.game.player)
    case IdleInputKey.Up:
      return new AIMoveEvent(Direction.up).act(this.game.player)

    case IdleInputKey.UpRight:
      return new AIMoveEvent(Direction.upRight).act(this.game.player)
    case IdleInputKey.UpLeft:
      return new AIMoveEvent(Direction.upLeft).act(this.game.player)
    case IdleInputKey.DownRight:
      return new AIMoveEvent(Direction.downRight).act(this.game.player)
    case IdleInputKey.DownLeft:
      return new AIMoveEvent(Direction.downLeft).act(this.game.player)

    case IdleInputKey.Handle:
      return new AIHandleEnvEvent().act(this.game.player)

    case IdleInputKey.PickUp:
      this.game.screen = new PickUpScreen(this.game)
      return

    case IdleInputKey.Inventory:
      this.game.screen = new InventoryScreen(this.game)
      return
    }
  }
}
