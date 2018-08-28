import { CreatureEvent } from './internal'
import { LevelMap } from '../models/level_map'
import { TileVisitor } from '../models/tile'
import { Creature, Game, Trap, Point, Reaction } from '../../engine'
import { Player } from '../models/creature'

class SteppingTileVisitor extends TileVisitor {
  constructor(
    private creature: Creature,
    private levelMap: LevelMap,
    private game: Game
  ) {
    super()
  }

  public onTrap(trap: Trap): void {
    trap.activate(this.game, this.levelMap, this.creature)
  }
}

export class MoveEvent extends CreatureEvent {
  constructor(
    private game: Game,
    private levelMap: LevelMap,
    private nextPoint: Point,
    private nextLevel: LevelMap | undefined = undefined
  ) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    const pos = this.levelMap.creaturePos(actor)

    if (this.nextLevel && this.nextLevel.id !== this.levelMap.id) {
      this.levelMap.removeCreature(actor)
      this.nextLevel.addCreature(this.nextPoint, actor)
    } else {
      this.levelMap.at(pos.x, pos.y).creature = undefined
      this.levelMap.at(this.nextPoint.x, this.nextPoint.y).creature = actor
    }

    ;(this.nextLevel || this.levelMap)
      .at(this.nextPoint.x, this.nextPoint.y)
      .visit(new SteppingTileVisitor(actor, this.levelMap, this.game))
    return Reaction.NOTHING
  }

  public affectPlayer(player: Player): Reaction {
    if (this.nextLevel && this.levelMap.id !== this.nextLevel.id) {
      this.levelMap.reset()
      this.nextLevel.enter()

      this.affectCreature(player)

      this.game.currentMap = this.nextLevel
    } else {
      this.affectCreature(player)
    }

    return Reaction.NOTHING
  }
}
