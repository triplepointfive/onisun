import { GoToTileAI } from './internal'
import { TileTypes, Creature, Ability, StairwayDown, Game } from '../../engine'

export class Descender extends GoToTileAI {
  private canDescend: boolean = false

  constructor() {
    super(tile => tile.tile.kind === TileTypes.StairwayDown)
  }

  public act(actor: Creature, game: Game): boolean {
    if (actor.can(Ability.GoStairwayDown)) {
      return super.act(actor, game)
    }

    return false
  }

  public reset(): void {
    super.reset()
    this.canDescend = false
  }

  protected foundNewTarget(actor: Creature, game: Game): boolean {
    const pos = game.currentMap.creaturePos(actor)
    // When we are on a stairway
    this.canDescend = this.matcher(
      actor.stageMemory(game.currentMap).at(pos.x, pos.y)
    )

    if (this.canDescend) {
      this.destination = pos
      return true
    } else {
      return super.foundNewTarget(actor, game)
    }
  }

  protected onReach(actor: Creature, game: Game) {
    // Should stay here at least for a turn
    const tile = game.currentMap.creatureTile(actor)
    if (this.canDescend && tile instanceof StairwayDown) {
      // tile.go(actor)
    }
  }
}
