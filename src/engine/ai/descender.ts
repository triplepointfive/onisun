import {
  Ability,
  Creature,
  Game,
  StairwayDown,
  MoveEvent,
  LevelMap,
} from '../../engine'
import { CreatureEvent } from '../events/internal'
import { TileVisitor } from '../models/tile'
import { GoToTileAI } from './internal'

class StairwayDownFinderVisitor extends TileVisitor {
  public match = false

  public onStairwayDown(): void {
    this.match = true
  }
}

class StairwayDownTileMoverVisitor extends TileVisitor {
  public event: CreatureEvent | undefined

  constructor(
    private actor: Creature,
    private game: Game,
    private levelMap: LevelMap
  ) {
    super()
  }

  public onStairwayDown(stairway: StairwayDown): void {
    // TODO: Do not do this if already connected
    const adjacentMap = this.game.getMap(stairway.adjacentMapId)
    stairway.enterPos = adjacentMap.matchStairs(
      this.levelMap.id,
      this.levelMap.creaturePos(this.actor)
    )

    this.event = new MoveEvent(
      this.game,
      this.levelMap,
      stairway.enterPos,
      adjacentMap
    )
  }
}

export class Descender extends GoToTileAI {
  constructor() {
    super(tile => {
      const visitor = new StairwayDownFinderVisitor()
      tile.visit(visitor)
      return visitor.match
    })
  }

  public act(
    actor: Creature,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    if (actor.can(Ability.GoStairwayDown)) {
      return super.act(actor, levelMap, game)
    }
  }

  protected onReach(actor: Creature, game: Game): CreatureEvent | undefined {
    // Should stay here at least for a turn
    const visitor = new StairwayDownTileMoverVisitor(
        actor,
        game,
        game.currentMap
      ),
      tile = game.currentMap.creatureTile(actor)

    tile.visit(visitor)
    return visitor.event
  }
}
