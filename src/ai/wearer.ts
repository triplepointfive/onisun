import { AI } from './internal'
import { Creature } from '../creature'
import { Equipment, Usage } from '../items/internal'
import { Modifier } from '../characteristics'
import { Wearing } from '../inventory'

export class Wearer extends AI {
  public available(actor: Creature): boolean {
    return true
  }

  public act(actor: Creature, firstTurn: boolean = true) {
    actor.inventory.cares().forEach(item => {
      if (item instanceof Equipment) {
        if (actor.inventory.canWear(item)) {
          const wearing = this.whereToWear(actor, item)

          if (wearing) {
            // TODO: Use matching slot
            actor.putOn(item)
          }
        }
      }
    })
  }

  private whereToWear(actor: Creature, item: Equipment): Wearing {
    const matches = actor.inventory.matchingEquip(item)

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
            wearing.equipment.modifier,
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
