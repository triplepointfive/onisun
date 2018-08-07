import { AI } from './internal'
import { Creature, Player } from '../creature'
import { ItemsBunch, Item } from '../items/internal'
import { Tile } from '../tile'
import { Logger } from '../logger'
import {
  Game,
  Wearing,
  allInventorySlots,
  Modifier,
  AIPutOnItem,
} from '../../engine'

import { compact, flatten, includes } from 'lodash'

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
