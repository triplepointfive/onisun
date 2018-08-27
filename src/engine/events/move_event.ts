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
    private nextLevel: LevelMap | undefined = undefined
  ) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    const currentLevel: LevelMap = this.game.currentMap,
      pos = currentLevel.creaturePos(actor)

    if (this.nextLevel && this.nextLevel.id !== currentLevel.id) {
      currentLevel.leave(actor)

      this.nextLevel.enter(actor, this.nextPoint)
      this.game.currentMap = this.nextLevel
      this.game.currentLevel = this.nextLevel
    } else {
      currentLevel.at(pos.x, pos.y).creature = undefined
    }

    currentLevel.addCreature(this.nextPoint, actor)

    currentLevel
      .at(this.nextPoint.x, this.nextPoint.y)
      .visit(new SteppingTileVisitor(actor, this.game))

    return Reaction.NOTHING
  }
}
