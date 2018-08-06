import { AI } from './internal'
import { Creature, Player, AttackEvent } from '../creature'
import { ItemsBunch, Item, GroupedItem, Potion } from '../items/internal'
import { Direction } from '../utils'
import { StairwayDown, StairwayUp, Tile } from '../tile'
import { Logger } from '../logger'
import {
  Game,
  Wearing,
  allInventorySlots,
  Modifier,
  PickUpScreen,
} from '../../engine'

import { compact, flatten, includes } from 'lodash'
import { IdleScreen } from '../screens/idle_screen'
import { InventorySlot } from '../inventory'

export abstract class AIEvent {
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

export class AIItemPickedEvent extends AIEvent {
  constructor(public items: ItemsBunch, game: Game) {
    super(game)
  }

  public act(): void {
    this.player.inventory.cares().forEach(item => {
      const wearing = this.whereToWear(item.item)

      if (wearing) {
        // TODO: Use matching slot
        new AIPutOnItem(wearing.inventorySlot, item.item, this.game).act()
      }
    })
  }

  private whereToWear(item: Item): Wearing {
    const matches: Wearing[] = compact(
      flatten(
        item.usages.map(usage =>
          allInventorySlots.filter(slot => includes(slot.usages, usage))
        )
      ).map(slot => this.player.inventory.matchingEquip(slot))
    )

    if (matches.length === 0) {
      return null
    }

    const weightModifier = new Modifier({
      attack: 1,
      defense: 1,
      health: 1,
      radius: 0.5,
      speed: 1,
    })

    const { wearing } = matches.reduce(
      (acc, wearing) => {
        let weight = 0

        if (wearing.equipment) {
          item.modifier.withWeight(
            wearing.equipment.item.modifier,
            weightModifier,
            (f, s, w) => (weight += w * (f - s))
          )
        } else {
          item.modifier.with(weightModifier, (f, w) => (weight += f * w))
        }

        if (acc.weight > weight) {
          return acc
        } else {
          return { weight, wearing }
        }
      },
      { weight: 0, wearing: null }
    )

    return wearing
  }
}

export class AIMoveEvent extends AIEvent {
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
  }
}

export class AIHandleEnvEvent extends AIEvent {
  public act(): void {
    const tile = this.tile()

    if (tile instanceof StairwayDown || tile instanceof StairwayUp) {
      tile.go(this.player)
    } else {
      this.player.currentLevel.game.logger.howToHandle()
    }
  }
}

export class AIPickUpItemsDialog extends AIEvent {
  public act(): void {
    const items = this.tile().items,
      game = this.player.currentLevel.game

    switch ((items && items.bunch.length) || 0) {
      case 0:
        game.logger.noItemsToPickUp()
        game.screen = new IdleScreen(this.game)
        return
      case 1:
        new AIPickUpItems(items.bunch, this.game).act()
        return
      default:
        game.screen = new PickUpScreen(game)
        return
    }
  }
}

export class AIPickUpItems extends AIEvent {
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

export class AIDropItems extends AIEvent {
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

export class AITakeOffItem extends AIEvent {
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

export class AIPutOnItem extends AIEvent {
  constructor(private slot: InventorySlot, private item: Item, game: Game) {
    super(game)
  }

  public act(): void {
    this.player.inventory.equip(this.player, this.slot, this.item)
    this.logger.putOn(this.item)
  }
}

export class AIDrinkItem extends AIEvent {
  constructor(private potion: Potion, game: Game) {
    super(game)
  }

  public act(): void {
    this.player.inventory.removeFromBag(this.potion, 1)
    this.potion.onDrink(this.game)
    this.logger.drink(this.potion)
  }
}

export abstract class MetaAI extends AI {
  constructor(public aiToRun: AI = null) {
    super()
  }
  protected events: AIEvent[] = []

  public available(actor: Creature): boolean {
    return true
  }

  public pushEvent(event: AIEvent) {
    this.events.push(event)
  }

  protected resetEvents(): void {
    this.events = []
  }

  public runEvents(): void {
    this.events.forEach(event => {
      event.act()
    })

    this.resetEvents()
  }
}
