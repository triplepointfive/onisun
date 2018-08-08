import { Logger } from '../logger';
import { Player, AttackEvent, ThrowEvent, Reaction, Creature } from '../creature';
import { Game } from '../game';
import { Tile, StairwayDown, StairwayUp } from '../tile';
import { Direction, Point, bresenham } from '../utils';
import { IdleScreen, PickUpScreen, GroupedItem, InventorySlot, Potion, Item, ItemFlightEffect, MissileSlot } from '../../engine';
import { MissileScreen } from '../screens/missile_screen';

export abstract class Controller {
  protected logger: Logger
  protected player: Player

  constructor(protected game: Game) {
    this.player = game.player
    this.logger = game.logger
  }

  public abstract act(): void

  protected tile(): Tile {
    return this.player.currentLevel.at(this.player.pos.x, this.player.pos.y)
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

    this.game.screen = undefined
  }
}

export class AIHandleEnvEvent extends Controller {
  public act(): void {
    const tile = this.tile()

    if (tile instanceof StairwayDown || tile instanceof StairwayUp) {
      tile.go(this.player)
      this.game.screen = undefined
    } else {
      this.player.currentLevel.game.logger.howToHandle()
    }
  }
}

export class AIPickUpItemsDialog extends Controller {
  public act(): void {
    const items = this.tile().items,
      game = this.player.currentLevel.game

    switch ((items && items.bunch.length) || 0) {
      case 0:
        game.logger.noItemsToPickUp()
        return
      case 1:
        new AIPickUpItems(items.bunch, this.game).act()
        this.game.screen = undefined
        return
      default:
        game.screen = new PickUpScreen(game)
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
      this.game.screen = new IdleScreen(this.game)
    }

    let tileItems = this.tile().items

    this.items.forEach(({ item, count }) => {
      this.player.inventory.putToBag(item, count)
      this.game.logger.pickedUpItem(item, count)
      tileItems.remove(item, count)
    })

    this.game.screen = undefined
  }
}

export class AIDropItems extends Controller {
  constructor(private items: GroupedItem[], game: Game) {
    super(game)
  }

  public act(): void {
    if (!this.items.length) {
      this.game.screen = new IdleScreen(this.game)
    }

    let tile = this.tile()

    this.items.forEach(({ item, count }) => {
      this.player.inventory.removeFromBag(item, count)
      this.game.logger.droppedItem(item, count)
      tile.addItem(item, count)
    })

    this.game.screen = undefined
  }
}

export class AITakeOffItem extends Controller {
  constructor(private slot: InventorySlot, game: Game) {
    super(game)
  }

  public act(): void {
    // TODO: assert slot is not empty
    const groupedItem = this.player.inventory.inSlot(this.slot)
    this.player.inventory.takeOff(this.player, this.slot)
    this.logger.takeOff(groupedItem.item)
  }
}

export class AIPutOnItem extends Controller {
  constructor(private slot: InventorySlot, private item: Item, game: Game) {
    super(game)
  }

  public act(): void {
    this.player.inventory.equip(this.player, this.slot, this.item)
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
    const missile = this.player.inventory.inSlot(MissileSlot)

    if (missile && missile.item) {
      this.game.screen = new MissileScreen(this.game)
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
    const missile = this.player.inventory.inSlot(MissileSlot).item
    this.player.inventory.removeWearing(this.player, MissileSlot, 1)

    let path = [], victim: Creature

    this.path.forEach(point => {
      if (!victim) {
        const tile = this.player.currentLevel.at(point.x, point.y)
        victim = tile.creature && tile.creature.real()
        this.path.push(point)
      }
    })

    const effect = new ItemFlightEffect(missile, path, () => {
      if (victim) {
        victim.on(new ThrowEvent(this.player, missile))
      }
    })

    this.player.currentLevel.addEffect(effect)
    this.game.screen = undefined
  }
}
