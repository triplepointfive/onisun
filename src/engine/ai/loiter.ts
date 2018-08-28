import { AI } from './internal'
import { Creature } from '../models/creature'
import { MoveEvent } from '../events/move_event'
import { Game } from '../models/game'
import { Point } from '../../engine'
import { CreatureEvent } from '../events/internal'

export class Loiter extends AI {
  public act(actor: Creature, game: Game): CreatureEvent | undefined {
    const pos = game.currentMap.creaturePos(actor),
      path = this.leePath(
        actor,
        actor.stageMemory(game.currentMap),
        pos,
        (point: Point) => !pos.eq(point),
        true
      )

    if (path.length) {
      return new MoveEvent(game, path[0])
    }

    return
  }
}
