import { Presenter, PresenterType, BaseMenusPresenter } from './internal'
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
  Stairway,
  LevelMap,
  LookPresenter,
  UntrapEvent,
  Point,
  BaseInfoPresenter,
  CloseDoorEvent,
} from '../../engine'
import { EquipmentPresenter } from './equipment_presenter'
import { MissilePresenter } from './missile_presenter'
import { MoveEvent } from '../events/move_event'
import { CreatureEvent, PlayerEvent } from '../events/internal'
import { concat } from 'lodash'
import { Trap, Door } from '../models/tile'
import { PickSingleOptionPresenter } from './pick_single_option_presenter'
import { StayEvent } from '../events/stay_event'
import { OpenDoorEvent } from '../events/open_door_event'

class HandleTileVisitor extends TileVisitor {
  // TODO: Add direction since commands might duplicate
  public commands: [string, PlayerEvent][] = []

  constructor(
    public position: Point,
    protected game: Game,
    protected levelMap: LevelMap
  ) {
    super()
  }

  protected onStairway(stairway: Stairway): void {
    const adjacentMap = this.game.getMap(stairway.adjacentMapName)

    this.commands.push([
      'stairway',
      new MoveEvent(
        this.game,
        this.levelMap,
        stairway.enterPos(this.levelMap, adjacentMap),
        adjacentMap
      ),
    ])
  }

  public onTrap(trap: Trap): void {
    if (!trap.revealed) {
      return
    }

    this.commands.push([
      'untrap',
      new UntrapEvent(this.position, trap, this.levelMap, this.game),
    ])
  }
}

class AdjustHandleTileVisitor extends HandleTileVisitor {
  protected onStairway(): void {}

  public onDoor(door: Door): void {
    if (door.open) {
      this.commands.push([
        'closeDoor',
        new CloseDoorEvent(door, this.levelMap, this.game),
      ])
    } else {
      this.commands.push([
        'openDoor',
        new OpenDoorEvent(door, this.levelMap, this.game),
      ])
    }
  }
}

export class IdlePresenter extends BaseMenusPresenter {
  get type(): PresenterType {
    return PresenterType.Idle
  }

  public inventoryCommand(): void {
    this.redirect(new EquipmentPresenter(this.levelMap, this.game))
  }

  public bagCommand(): void {
    this.redirect(new BagPresenter(this.levelMap, this.game))
  }

  public stayCommand(): void {
    this.player.on(new StayEvent(this.levelMap))
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
      this.player
        .stageMemory(this.levelMap)
        .at(dest.x, dest.y)
        .see(tile, 0)
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
    let pos = this.levelMap.creaturePos(this.player),
      visitor = new HandleTileVisitor(pos, this.game, this.levelMap),
      adjustVisitor = new AdjustHandleTileVisitor(pos, this.game, this.levelMap)

    this.tile.visit(visitor)

    pos.wrappers().forEach((point: Point) => {
      adjustVisitor.position = point
      this.levelMap.at(point.x, point.y).visit(adjustVisitor)
    })

    const commands = concat(visitor.commands, adjustVisitor.commands)

    switch (commands.length) {
      case 0:
        this.game.logger.howToHandle()
        break
      case 1:
        this.player.on(commands[0][1])
        this.endTurn()
        break
      default:
        this.redirect(
          new PickSingleOptionPresenter(
            commands,
            this.levelMap,
            this.game,
            ([name, command]) => {
              this.player.on(command)
              this.endTurn()
            }
          )
        )
    }
  }
}
