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
  LookPresenter,
} from '../../engine'
import { InventoryPresenter } from './inventory_presenter'
import { MissilePresenter } from './missile_presenter'
import { MoveEvent } from '../events/move_event'

class HandleTileVisitor extends TileVisitor {
  constructor(
    private game: Game,
    private levelMap: LevelMap,
    private player: Player,
    private done: () => void
  ) {
    super()
  }

  protected onStairway(stairway: Stairway): void {
    // TODO: Do not do this if already connected
    // TODO: Remove duplicity!!! descender.ts
    const adjacentMap = this.game.getMap(stairway.adjacentMapId)
    stairway.enterPos = adjacentMap.matchStairs(
      this.levelMap.id,
      this.levelMap.creaturePos(this.player)
    )
    this.player.on(
      new MoveEvent(this.game, this.levelMap, stairway.enterPos, adjacentMap)
    )

    this.done()
  }

  protected default(): void {
    this.game.logger.howToHandle()
  }
}

export class IdlePresenter extends Presenter {
  constructor(levelMap: LevelMap, game: Game) {
    super(PresenterType.Idle, levelMap, game)
  }

  public inventoryCommand(): void {
    this.redirect(new InventoryPresenter(this.levelMap, this.game))
  }

  public bagCommand(): void {
    this.redirect(new BagPresenter(this.levelMap, this.game))
  }

  public stayCommand(): void {
    this.endTurn()
  }

  public dropCommand(): void {
    this.redirect(new DropItemsPresenter(this.levelMap, this.game))
  }

  public drinkCommand(): void {
    this.redirect(new DrinkPresenter(this.levelMap, this.game))
  }

  public lookCommand(): void {
    this.redirect(new LookPresenter(this.levelMap, this.game))
  }

  public move(direction: Direction): void {
    const pos = this.levelMap.creaturePos(this.player),
      dest = pos.add(direction),
      tile = this.levelMap.at(dest.x, dest.y)

    if (tile.passibleThrough(this.player)) {
      this.player.on(new MoveEvent(this.game, this.levelMap, dest))
    } else if (tile.creature) {
      this.player.on(new AttackEvent(tile.creature, this.levelMap, this.game))
    } else {
      this.game.logger.ranIntoAnObstacle()
    }

    this.endTurn()
  }

  public pickUpCommand(): void {
    const tile = this.tile,
      items = tile.items

    if (items === undefined || items.bunch.length === 0) {
      this.game.logger.noItemsToPickUp()
    } else if (items.bunch.length === 1) {
      this.player.on(new PickUpItemsEvent(tile, items.bunch, this.game))
      this.endTurn()
    } else {
      this.redirect(new PickUpPresenter(this.levelMap, this.game))
    }
  }

  public missileCommand(): void {
    const missile = this.player.inventory.missileSlot.equipment

    if (missile && missile.item) {
      if (missile.item.canThrow(this.player)) {
        this.redirect(new MissilePresenter(this.levelMap, this.game))
      } else {
        this.game.logger.needMissileWeapon()
      }
    } else {
      this.game.logger.nothingToShotWith()
    }
  }

  public handleCommand(): void {
    this.tile.visit(
      new HandleTileVisitor(this.game, this.levelMap, this.player, () =>
        this.endTurn()
      )
    )
  }
}
