import { Presenter, PresenterType } from './internal'
import {
  Game,
  Direction,
  DropItemsPresenter,
  DrinkPresenter,
  BagPresenter,
  AttackEvent,
  PickUpItemsEvent,
  PickUpPresenter,
  TileVisitor,
  Player,
  Stairway,
  LevelMap,
} from '../../engine'
import { InventoryPresenter } from './inventory_presenter'
import { MissilePresenter } from './missile_presenter'
import { MoveEvent } from '../events/move_event'

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

class HandleTileVisitor extends TileVisitor {
  constructor(
    private game: Game,
    private map: LevelMap,
    private player: Player,
    private done: () => void
  ) {
    super()
  }

  protected onStairway(stairway: Stairway): void {
    // TODO: Do not do this if already connected
    const adjacentMap = this.game.getMap(stairway.adjacentMapId)
    stairway.enterPos = adjacentMap.matchStairs(
      this.map.id,
      this.map.creaturePos(this.player)
    )
    this.player.on(new MoveEvent(this.game, stairway.enterPos, adjacentMap))

    this.done()
  }

  protected default(): void {
    this.game.logger.howToHandle()
  }
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
        return this.handle()

      case IdleInputKey.PickUp:
        return this.pickUpDialog()
      case IdleInputKey.Missile:
        return this.missileDialog()

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
    const pos = this.currentLevel.creaturePos(this.player),
      dest = pos.add(direction),
      tile = this.currentLevel.at(dest.x, dest.y)

    if (tile.passibleThrough(this.player)) {
      this.player.on(new MoveEvent(this.game, dest))
    } else if (tile.creature) {
      tile.creature.on(new AttackEvent(this.player, this.game))
    } else {
      this.game.logger.ranIntoAnObstacle()
    }

    this.endTurn()
  }

  private pickUpDialog(): void {
    const tile = this.tile,
      items = tile.items

    if (items === undefined || items.bunch.length === 0) {
      this.game.logger.noItemsToPickUp()
    } else if (items.bunch.length === 1) {
      this.player.on(new PickUpItemsEvent(tile, items.bunch, this.game))
      this.endTurn()
    } else {
      this.redirect(new PickUpPresenter(this.game))
    }
  }

  private missileDialog(): void {
    const missile = this.player.inventory.missileSlot.equipment

    if (missile && missile.item) {
      if (missile.item.canThrow(this.player)) {
        this.redirect(new MissilePresenter(this.game))
      } else {
        this.game.logger.needMissileWeapon()
      }
    } else {
      this.game.logger.nothingToShotWith()
    }
  }

  private handle(): void {
    this.tile.visit(
      new HandleTileVisitor(this.game, this.game.currentMap, this.player, () =>
        this.endTurn()
      )
    )
  }
}
