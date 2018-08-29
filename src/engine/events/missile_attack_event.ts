import { CreatureEvent } from './internal'
import { Point } from '../utils/utils'
import { Creature, Reaction } from '../models/creature'
import { ItemFlightTileEffect } from '../models/tile_effect'
import { ThrowEvent } from './throw_event'
import { Game } from '../models/game'
import { LevelMap } from '../models/level_map'

export class MissileAttackEvent extends CreatureEvent {
  constructor(
    private path: Point[],
    private game: Game,
    private levelMap: LevelMap,
    private done: (reaction: Reaction) => void
  ) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    const slot = actor.inventory.missileSlot

    if (slot.equipment === undefined) {
      throw 'MissileAttackEvent: slot has no items'
    }

    const missile = slot.equipment.item

    slot.removeItem(actor, 1)

    actor.stuffWeight.subtract(missile.weight)

    let flightPath: Point[] = [],
      victim: Creature | undefined

    this.path.forEach(point => {
      if (!victim) {
        const tile = this.levelMap.at(point.x, point.y)
        victim = tile.creature
        flightPath.push(point)
      }
    })

    this.game.effect = new ItemFlightTileEffect(missile, flightPath, () => {
      if (victim) {
        this.done(
          victim.on(new ThrowEvent(actor, missile, this.levelMap, this.game))
        )
      } else {
        this.done(Reaction.NOTHING)
      }
    })

    return Reaction.NOTHING
  }
}
