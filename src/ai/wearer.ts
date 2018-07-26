import { AI } from './internal'
import { Creature, Ability } from '../creature'
import { Item } from '../items/internal'
import { Modifier } from '../characteristics'
import { Wearing, allInventorySlots } from '../inventory'

import { flatten, compact } from 'lodash'

export class Wearer extends AI {
  public available(actor: Creature): boolean {
    return actor.can(Ability.PutOn)
  }

  public act(actor: Creature, firstTurn: boolean = true) {
    actor.inventory.cares().forEach(item => {
      const wearing = this.whereToWear(actor, item.item)

      if (wearing) {
        // TODO: Use matching slot
        actor.putOn(wearing.bodyPart, item.item)
      }
    })
  }

  private whereToWear(actor: Creature, item: Item): Wearing {
    const matches: Wearing[] = compact(flatten(
      item.usages.map(usage =>
        allInventorySlots.filter(slot => slot.usage === usage)
      )
    ).map(slot => actor.inventory.matchingEquip(slot)))

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
