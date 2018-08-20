import { CreatureEvent } from './internal'
import { Point } from '../utils'
import { Game } from '../game'
import { Creature, Reaction } from '../creature'
import { ItemFlightTileEffect } from '../tile_effect'
import { ThrowEvent } from './throw_event'

export class MissileAttackEvent extends CreatureEvent {
  constructor(
    private path: Point[],
    private game: Game,
    private done: (reaction: Reaction) => void
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

    this.game.effect = new ItemFlightTileEffect(missile, flightPath, () => {
      if (victim) {
        this.done(victim.on(new ThrowEvent(actor, missile)))
      } else {
        this.done(Reaction.NOTHING)
      }
    })

    return Reaction.NOTHING
  }
}
