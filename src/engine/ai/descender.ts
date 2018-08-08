import { GoToTileAI, MetaAI } from '../ai'
import { Ability, Creature, StairwayDown, TileTypes } from '../../engine'

export class Descender extends GoToTileAI {
  private canDescend: boolean = false

  constructor(metaAI: MetaAI) {
    super(metaAI, tile => tile.tile.kind === TileTypes.StairwayDown)
  }

  public available(actor: Creature): boolean {
    return actor.can(Ability.GoStairwayDown) && super.available(actor)
  }

  public reset(): void {
    super.reset()
    this.canDescend = false
  }

  protected foundNewTarget(actor: Creature): boolean {
    // When we are on a stairway
    this.canDescend = this.matcher(
      actor.stageMemory().at(actor.pos.x, actor.pos.y)
    )

    if (this.canDescend) {
      this.destination = actor.pos
      return true
    } else {
      return super.foundNewTarget(actor)
    }
  }

  protected onReach(actor: Creature) {
    // Should stay here at least for a turn
    const tile = actor.currentLevel.at(actor.pos.x, actor.pos.y)
    if (this.canDescend && tile instanceof StairwayDown) {
      tile.go(actor)
    }
  }
}