import { Creature } from '../models/creature'
import { LevelMap, Game } from '../../engine'
import { CreatureEvent } from './internal'

export abstract class VisibleCreatureEvent extends CreatureEvent {
  constructor(protected levelMap: LevelMap, protected game: Game) {
    super()
  }

  protected playerSees(actor: Creature): boolean {
    let { x, y } = this.levelMap.creaturePos(actor)
    return this.game.player.stageMemory(this.levelMap).at(x, y).visible
  }
}
