import { Creature, Reaction } from '../models/creature'
import { Player } from '../models/player'
import { LevelMap, Game } from '../../engine'

export abstract class CreatureEvent {
  public abstract affectCreature(subject: Creature): Reaction
  public affectPlayer(subject: Player): Reaction {
    return this.affectCreature(subject)
  }
}

export abstract class VisibleCreatureEvent extends CreatureEvent {
  constructor(protected levelMap: LevelMap, protected game: Game) {
    super()
  }

  protected playerSees(actor: Creature): boolean {
    let pos = this.levelMap.creaturePos(actor)
    return this.game.player.stageMemory(this.levelMap).at(pos.x, pos.y).visible
  }
}
