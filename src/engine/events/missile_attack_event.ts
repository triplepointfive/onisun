import { CreatureEvent } from './internal'
import { Point } from '../utils'
import { Game } from '../game'
import { Creature, Reaction } from '../creature'
import { ItemFlightEffect } from '../effect'
import { ThrowEvent } from './throw_event'

export class MissileAttackEvent extends CreatureEvent {
  constructor(
    private path: Point[],
    private game: Game,
    private done: () => void
  ) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    const slot = actor.inventory.missileSlot,
      missile = slot.equipment.item

    slot.removeItem(actor, 1)

    let flightPath: Point[] = [],
      victim: Creature

    this.path.forEach(point => {
      if (!victim) {
        const tile = actor.currentLevel.at(point.x, point.y)
        victim = tile.creature && tile.creature.real()
        flightPath.push(point)
      }
    })

    this.game.effect = new ItemFlightEffect(missile, flightPath, () => {
      if (victim) {
        victim.on(new ThrowEvent(actor, missile)) === Reaction.DIE
      }

      this.done()
    })

    return Reaction.NOTHING
  }
}
