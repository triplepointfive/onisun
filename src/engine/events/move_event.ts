import { CreatureEvent } from './internal'
import { LevelMap } from '../models/level_map'
import { TileVisitor } from '../models/tile'
import { Creature, Game, Trap, Point, Reaction } from '../../engine'

class SteppingTileVisitor extends TileVisitor {
  constructor(private creature: Creature, private game: Game) {
    super()
  }

  public onTrap(trap: Trap): void {
    trap.activate(this.game, this.creature)
  }
}

export class MoveEvent extends CreatureEvent {
  constructor(
    private game: Game,
    private nextPoint: Point,
    private nextLevel: LevelMap = undefined
  ) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    if (this.nextLevel && this.nextLevel.id !== actor.currentLevel.id) {
      actor.currentLevel.leave(actor)

      this.nextLevel.enter(actor, this.nextPoint)
      this.game.currentMap = this.nextLevel
      actor.currentLevel = this.nextLevel
    } else {
      actor.currentLevel.at(actor.pos.x, actor.pos.y).creature = undefined
    }

    actor.pos = this.nextPoint.copy()

    actor.currentLevel.at(actor.pos.x, actor.pos.y).creature = actor

    actor.currentLevel
      .at(actor.pos.x, actor.pos.y)
      .visit(new SteppingTileVisitor(actor, this.game))

    return Reaction.NOTHING
  }
}
