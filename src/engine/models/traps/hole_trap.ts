import {
  Creature,
  Point,
  safeWithMatchingTile,
  TrapEvent,
  withEachTile,
} from '../../../engine'
import { CreatureEvent } from '../../events/internal'
import { MoveEvent } from '../../events/move_event'
import { StayEvent } from '../../events/stay_event'
import { Game } from '../game'
import { LevelMap } from '../level_map'
import { Player } from '../player'
import { StairwayDown, Tile, Trap, TrapType } from '../tile'
import { HurtEvent } from '../../events/hurt_event'
import { DamageType } from '../../lib/damage'
import { DieReason } from '../../events/die_event'
import { Reaction } from '../creature'

// Leads to a random tile every time because tile might be taken
// by another creature next time you are falling down
export class HoleTrap extends Trap {
  constructor(tile: Tile, revealed: boolean = false) {
    super(TrapType.Hole, tile, revealed)
  }

  public buildNew(): Tile {
    return new HoleTrap(this.tile, this.revealed)
  }

  public untrap(
    pos: Point,
    player: Player,
    levelMap: LevelMap,
    game: Game
  ): void {
    game.logger.canNotUntrap()
  }

  get dodgeRatio(): number {
    return this.revealed ? 1 : 5
  }

  public activate(
    pos: Point,
    game: Game,
    levelMap: LevelMap,
    creature: Creature
  ): Reaction {
    return creature.on(
      new TrapEvent(
        this,
        levelMap,
        game,
        (sees, isPlayer) =>
          game.logger.trapHole.dodge(sees, isPlayer, creature),
        (sees, isPlayer) => {
          // TODO: Break fragile items
          let fallEvent = this.fallEvent(game, levelMap)

          if (fallEvent) {
            game.logger.trapHole.activated(sees, isPlayer, creature)

            creature.on(fallEvent)
            return creature.on(
              new HurtEvent(
                [
                  {
                    type: DamageType.Pure,
                    dice: { times: 3, max: 2 },
                    extra: 2,
                  },
                ],
                DieReason.Trap,
                levelMap,
                game
              )
            )
          } else {
            game.logger.trapHole.shallowActivated(sees, isPlayer, creature)

            return creature.on(new StayEvent(levelMap))
          }
        }
      )
    )
  }

  private fallEvent(game: Game, levelMap: LevelMap): CreatureEvent | undefined {
    let event = undefined

    withEachTile(
      levelMap,
      () => true,
      tile => {
        if (tile instanceof StairwayDown) {
          let downLevelMap = game.getMap(tile.adjacentMapName),
            downPos = undefined

          downPos = safeWithMatchingTile(downLevelMap, tile =>
            tile.passibleThrough()
          )

          if (downPos) {
            event = new MoveEvent(
              game,
              levelMap,
              new Point(downPos.x, downPos.y),
              downLevelMap
            )
          }
        }
      }
    )

    return event
  }
}
