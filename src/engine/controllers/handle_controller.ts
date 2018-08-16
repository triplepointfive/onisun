import { TileVisitor, Stairway } from '../tile'
import { Controller } from './internal'
import { Player } from '../creature'
import { Game } from '../game'

class HandleTileVisitor extends TileVisitor {
  constructor(private game: Game, private player: Player) {
    super()
  }

  protected onStairway(stairway: Stairway): void {
    // TODO: Do not do this if already connected
    const adjacentMap = this.game.getMap(stairway.adjacentMapId)
    stairway.enterPos = adjacentMap.matchStairs(
      this.player.currentLevel.id,
      this.player.pos
    )
    this.player.move(stairway.enterPos, adjacentMap)

    this.game.ai.endTurn()
  }

  protected default(): void {
    this.game.logger.howToHandle()
  }
}

export class HandleController extends Controller {
  public act(): void {
    this.tile().visit(new HandleTileVisitor(this.game, this.player))
  }
}
