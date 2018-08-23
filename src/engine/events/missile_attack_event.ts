import { CreatureEvent } from './internal'
import { Point } from '../utils/utils'
import { Creature, Reaction } from '../models/creature'
import { ItemFlightTileEffect } from '../models/tile_effect'
import { ThrowEvent } from './throw_event'
import { Game } from '../models/game'

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

    actor.stuffWeight.subtract(missile.weight)
    this.onStuffWeightChange(actor)

    let flightPath: Point[] = [],
      victim: Creature

    this.path.forEach(point => {
      if (!victim) {
        const tile = actor.currentLevel.at(point.x, point.y)
        victim = tile.creature && tile.creature
        flightPath.push(point)
      }
    })

    this.game.effect = new ItemFlightTileEffect(missile, flightPath, () => {
      if (victim) {
        this.done(victim.on(new ThrowEvent(actor, missile, this.game)))
      } else {
        this.done(Reaction.NOTHING)
      }
    })

    return Reaction.NOTHING
  }
}
