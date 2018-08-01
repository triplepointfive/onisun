import { AI } from './internal'
import { Creature, Player, AttackEvent } from '../creature'
import { ItemsBunch, Item } from '../items/internal'
import { Direction } from '../utils'
import { StairwayDown, StairwayUp } from '../tile';
import { PickUpScreen } from 'src/screen';
import { Logger } from '../logger';
import { Game, Wearing, allInventorySlots, Modifier } from 'src/engine';

import { compact, flatten } from 'lodash'

export abstract class AIEvent {
  protected logger: Logger
  protected player: Player

  constructor(protected game: Game) {
    this.player = game.player
    this.logger = game.logger
  }

  public abstract act(): void
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
        this.player.putOn(wearing.bodyPart, item.item)
      }
    })
  }

  private whereToWear(item: Item): Wearing {
    const matches: Wearing[] = compact(flatten(
      item.usages.map(usage =>
        allInventorySlots.filter(slot => slot.usage === usage)
      )
    ).map(slot => this.player.inventory.matchingEquip(slot)))

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
    const tile = this.player.currentLevel.at(this.player.pos.x, this.player.pos.y)

    if (tile instanceof StairwayDown || tile instanceof StairwayUp) {
      tile.go(this.player)
    } else {
      this.player.currentLevel.game.logger.howToHandle()
    }
  }
}

export class AIPickUpItems extends AIEvent {
  public act(): void {
    const items = this.player.currentLevel.at(this.player.pos.x, this.player.pos.y).items,
      game = this.player.currentLevel.game

    switch ((items && items.bunch.length) || 0) {
    case 0:
      game.logger.noItemsToPickUp()
      game.screen = undefined
      return
    case 1:
      const { item, count } = items.bunch[0]
      this.player.inventory.putToBag(item, count)
      game.logger.pickedUpItem(item, count)
      items.remove(item, count)
      game.screen = undefined
      return
    default:
      game.screen = new PickUpScreen(game)
      return
    }
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

  public runEvents(player: Player): void {
    this.events.forEach(event => {
      event.act()
    })

    this.resetEvents()
  }
}
