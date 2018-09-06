import { Creature, Reaction } from '../models/creature'
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

export class MessageCreatureEvent extends VisibleCreatureEvent {
  constructor(
    levelMap: LevelMap,
    game: Game,
    private onCreature: () => void,
    private onPlayer: () => void
  ) {
    super(levelMap, game)
  }

  public affectCreature(actor: Creature): Reaction {
    if (this.playerSees(actor)) {
      this.onCreature()
    }

    return Reaction.NOTHING
  }

  public affectPlayer(): Reaction {
    this.onPlayer()

    return Reaction.NOTHING
  }
}
