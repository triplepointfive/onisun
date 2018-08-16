import { Logger } from '../logger'
import { Player, Creature, Reaction } from '../creature'
import { AttackEvent, ThrowEvent } from '../event'
import { Game } from '../game'
import { Tile } from '../tile'
import { Direction, Point } from '../utils'
import {
  IdlePresenter,
  PickUpPresenter,
  GroupedItem,
  InventorySlot,
  Potion,
  Item,
  ItemFlightEffect,
} from '../../engine'
import { MissilePresenter } from '../presenters/missile_presenter'
import { LevelMap } from '../level_map'
import { Presenter } from '../presenters/internal';

export abstract class Controller {
  protected logger: Logger
  protected player: Player

  constructor(protected game: Game) {
    this.player = game.player
    this.logger = game.logger
  }

  public abstract act(): void

  protected currentLevel(): LevelMap {
    return this.player.currentLevel
  }

  protected tile(): Tile {
    return this.currentLevel().at(this.player.pos.x, this.player.pos.y)
  }

  protected endTurn(): void {
    this.game.ai.endTurn()
  }

  protected redirect(presenter: Presenter): void {
    this.game.ai.redirect(presenter)
  }
}

export class AIMoveEvent extends Controller {
  constructor(public direction: Direction, game: Game) {
    super(game)
  }

  public act(): void {
    const stage = this.player.currentLevel,
      dest = this.player.pos.add(this.direction),
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
}

export class AIPickUpItemsDialog extends Controller {
  public act(): void {
    const items = this.tile().items

    switch ((items && items.bunch.length) || 0) {
      case 0:
        this.game.logger.noItemsToPickUp()
        return
      case 1:
        new AIPickUpItems(items.bunch, this.game).act()
        return
      default:
        this.redirect(new PickUpPresenter(this.game))
        return
    }
  }
}

export class AIPickUpItems extends Controller {
  constructor(private items: GroupedItem[], game: Game) {
    super(game)
  }

  public act(): void {
    if (!this.items.length) {
      this.redirect(new IdlePresenter(this.game))
    }

    let tileItems = this.tile().items

    this.items.forEach(({ item, count }) => {
      this.player.inventory.putToBag(item, count)
      this.game.logger.pickedUpItem(item, count)
      tileItems.remove(item, count)
    })

    this.endTurn()
  }
}

export class AIDropItems extends Controller {
  constructor(private items: GroupedItem[], game: Game) {
    super(game)
  }

  public act(): void {
    if (!this.items.length) {
      this.redirect(new IdlePresenter(this.game))
    }

    let tile = this.tile()

    this.items.forEach(({ item, count }) => {
      this.player.inventory.removeFromBag(item, count)
      this.game.logger.droppedItem(item, count)
      tile.addItem(item, count)
    })

    this.endTurn()
  }
}

export class AITakeOffItem extends Controller {
  constructor(private slot: InventorySlot, game: Game) {
    super(game)
  }

  public act(): void {
    // TODO: assert slot is not empty
    const groupedItem = this.slot.equipment
    this.slot.takeOff(this.player)
    this.logger.takeOff(groupedItem.item)
  }
}

export class AIPutOnItem extends Controller {
  constructor(private slot: InventorySlot, private item: Item, game: Game) {
    super(game)
  }

  public act(): void {
    this.slot.equip(this.player, this.item)
    this.logger.putOn(this.item)
  }
}

export class AIDrinkItem extends Controller {
  constructor(private potion: Potion, game: Game) {
    super(game)
  }

  public act(): void {
    this.player.inventory.removeFromBag(this.potion, 1)
    this.potion.onDrink(this.game)
    this.logger.drink(this.potion)
  }
}

export class AIMissileDialog extends Controller {
  public act(): void {
    const missile = this.player.inventory.missileSlot.equipment

    if (missile && missile.item) {
      if (missile.item.canThrow(this.player)) {
        this.redirect(new MissilePresenter(this.game))
      } else {
        this.logger.needMissileWeapon()
      }
    } else {
      this.logger.nothingToShotWith()
    }
  }
}

export class AIMissileAttack extends Controller {
  constructor(private path: Point[], game: Game) {
    super(game)
  }

  public act(): void {
    const slot = this.player.inventory.missileSlot,
      missile = slot.equipment.item

    slot.removeItem(this.player, 1)

    let flightPath = [],
      victim: Creature

    this.path.forEach(point => {
      if (!victim) {
        const tile = this.player.currentLevel.at(point.x, point.y)
        victim = tile.creature && tile.creature.real()
        flightPath.push(point)
      }
    })

    this.game.effect = new ItemFlightEffect(missile, flightPath, () => {
      if (victim) {
        victim.on(new ThrowEvent(this.player, missile)) === Reaction.DIE
        this.endTurn()
      }
    })
  }
}
