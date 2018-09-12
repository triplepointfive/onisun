import { CreatureEvent } from './internal'
import { LevelMap } from '../models/level_map'
import { TileVisitor, TriggerTile } from '../models/tile'
import { Creature, Game, Trap, Point, Reaction } from '../../engine'
import { Player } from '../models/player'

class SteppingTileVisitor extends TileVisitor {
  public reaction: Reaction = Reaction.NOTHING

  constructor(
    private pos: Point,
    private creature: Creature,
    private levelMap: LevelMap,
    private game: Game
  ) {
    super()
  }

  public onTrap(trap: Trap): void {
    this.reaction = trap.activate(
      this.pos,
      this.game,
      this.levelMap,
      this.creature
    )
  }

  public onTrigger(trigger: TriggerTile): void {
    trigger.activate(this.game, this.levelMap, this.creature)
  }
}

export class MoveEvent extends CreatureEvent {
  constructor(
    private game: Game,
    private levelMap: LevelMap,
    private nextPoint: Point,
    private nextLevel: LevelMap = levelMap
  ) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    const pos = this.levelMap.creaturePos(actor)

    if (this.nextLevel.id !== this.levelMap.id) {
      this.levelMap.removeCreature(actor)
      this.nextLevel.addCreature(this.nextPoint, actor)
    } else {
      this.levelMap.at(pos.x, pos.y).creature = undefined
      this.levelMap.at(this.nextPoint.x, this.nextPoint.y).creature = actor
    }

    const visitor = new SteppingTileVisitor(
      this.nextPoint,
      actor,
      this.levelMap,
      this.game
    )
    this.nextLevel.at(this.nextPoint.x, this.nextPoint.y).visit(visitor)

    return visitor.reaction
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
