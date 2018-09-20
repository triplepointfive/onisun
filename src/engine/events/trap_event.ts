import { VisibleCreatureEvent } from './visible_creature_event'
import { Trap } from '../models/tile'
import { Creature } from '../models/creature'
import { Player } from '../models/player'
import { Game } from '../models/game'
import { LevelMap } from '../models/level_map'
import { Calculator } from '../lib/calculator'
import { Reaction } from './internal'

export class TrapEvent extends VisibleCreatureEvent {
  private dodgeRatio: number

  constructor(
    private trap: Trap,
    levelMap: LevelMap,
    game: Game,
    private onCreatureDodge: (sees: boolean, isPlayer: boolean) => void,
    private onCreatureActivated: (sees: boolean, isPlayer: boolean) => Reaction
  ) {
    super(levelMap, game)
    // Calc ratio *before* any interaction with trap
    this.dodgeRatio = trap.dodgeRatio
  }

  public affectCreature(actor: Creature): Reaction {
    // TODO: Special messages for dying.
    const sees = this.playerSees(actor)
    if (sees) {
      this.trap.revealed = true
    }

    if (this.dodges(actor)) {
      this.onCreatureDodge(sees, false)
      return Reaction.DODGE
    } else {
      return this.onCreatureActivated(sees, false)
    }
  }

  public affectPlayer(actor: Player): Reaction {
    this.trap.revealed = true

    if (this.dodges(actor)) {
      this.onCreatureDodge(true, true)
      return Reaction.DODGE
    } else {
      return this.onCreatureActivated(true, true)
    }
  }

  protected dodges(actor: Creature): boolean {
    return Calculator.dodges(actor.bodyControl, this.dodgeRatio)
  }
}
