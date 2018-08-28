import { AI } from './internal'
import { Creature } from '../models/creature'
import { Game } from '../models/game'
import { Point, LevelMap } from '../../engine'
import { CreatureEvent } from '../events/internal'

export class Loiter extends AI {
  public act(
    actor: Creature,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    const pos = levelMap.creaturePos(actor)

    return this.move(actor, levelMap, game, (point: Point) => !pos.eq(point))
  }
}
