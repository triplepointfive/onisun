import { CreatureEvent } from './internal'
import { Point } from '../utils/utils'
import { Creature, Reaction, Player } from '../models/creature'
import { ItemFlightTileEffect } from '../models/tile_effect'
import { ThrowEvent } from './throw_event'
import { Game } from '../models/game'
import { LevelMap } from '../models/level_map'
import { Missile } from '../models/items'

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
    let missile = actor.missile

    if (!missile) {
      throw 'MissileAttackEvent called when actor has no missiles'
    }

    this.withMissile(actor, missile.item)

    return Reaction.NOTHING
  }

  public affectPlayer(player: Player): Reaction {
    const missile = player.missile

    if (!missile) {
      throw 'MissileAttackEvent: slot has no items'
    }

    this.withMissile(player, missile.item)

    player.inventory.missileSlot.removeItem(player, 1)
    player.stuffWeight.subtract(missile.item.weight)

    return Reaction.NOTHING
  }

  private withMissile(actor: Creature, missile: Missile): void {
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
          actor.on(new ThrowEvent(victim, missile, this.levelMap, this.game))
        )
      } else {
        this.done(Reaction.NOTHING)
      }
    })
  }
}
