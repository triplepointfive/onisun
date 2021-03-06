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

  constructor(private game: Game, private levelMap: LevelMap) {
    super()
  }

  public onStairwayDown(stairway: StairwayDown): void {
    const adjacentMap = this.game.getMap(stairway.adjacentMapName)

    this.event = new MoveEvent(
      this.game,
      this.levelMap,
      stairway.enterPos(this.levelMap, adjacentMap),
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
    if (actor.hasAbility(Ability.GoStairway)) {
      return super.act(actor, levelMap, game)
    }
  }

  protected onReach(
    actor: Creature,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    // Should stay here at least for a turn
    const visitor = new StairwayDownTileMoverVisitor(game, levelMap),
      tile = levelMap.creatureTile(actor)

    tile.visit(visitor)
    return visitor.event
  }
}
