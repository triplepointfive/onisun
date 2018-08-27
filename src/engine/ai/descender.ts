import { GoToTileAI } from './internal'

import { MetaAI } from './meta_ai'

import { TileTypes, Creature, Ability, StairwayDown, Game } from '../../engine'

export class Descender extends GoToTileAI {
  private canDescend: boolean = false

  constructor(metaAI: MetaAI) {
    super(metaAI, tile => tile.tile.kind === TileTypes.StairwayDown)
  }

  public available(actor: Creature, game: Game): boolean {
    return actor.can(Ability.GoStairwayDown) && super.available(actor, game)
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
