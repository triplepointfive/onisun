import { CreatureEvent } from './internal'
import { LevelMap } from '../models/level_map'
import { TileVisitor } from '../models/tile'
import { Creature, Game, Trap, Point, Reaction } from '../../engine'
import { Player } from '../models/creature'

class SteppingTileVisitor extends TileVisitor { constructor(private creature: Creature, private game: Game) {
    super()
  }

  public onTrap(trap: Trap): void {
    trap.activate(this.game, this.creature)
  }
}

export class MoveEvent extends CreatureEvent {
  private currentLevel: LevelMap

  constructor(
    private game: Game,
    private nextPoint: Point,
    private nextLevel: LevelMap | undefined = undefined
  ) {
    super()
    this.currentLevel = this.game.currentMap
  }

  public affectCreature(actor: Creature): Reaction {
    const pos = this.currentLevel.creaturePos(actor)

    if (this.nextLevel && this.nextLevel.id !== this.currentLevel.id) {
      this.currentLevel.removeCreature(actor)
      this.nextLevel.addCreature(this.nextPoint, actor)
    } else {
      this.currentLevel.at(pos.x, pos.y).creature = undefined
      this.currentLevel.at(this.nextPoint.x, this.nextPoint.y).creature = actor
    }

    (this.nextLevel || this.currentLevel)
      .at(this.nextPoint.x, this.nextPoint.y)
      .visit(new SteppingTileVisitor(actor, this.game))
    return Reaction.NOTHING
  }

  public affectPlayer(player: Player): Reaction {
    if (this.nextLevel && this.currentLevel.id !== this.nextLevel.id) {
      this.currentLevel.reset()
      this.nextLevel.enter()

      this.affectCreature(player)

      this.game.currentMap = this.nextLevel
    } else {
      this.affectCreature(player)
    }

    return Reaction.NOTHING
  }
}
