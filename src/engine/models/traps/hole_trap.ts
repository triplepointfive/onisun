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

  public activate(game: Game, levelMap: LevelMap, creature: Creature): void {
    creature.on(
      new TrapEvent(
        this,
        this.revealed ? 1 : 5,
        levelMap,
        game,
        (sees, isPlayer) => {
          if (isPlayer) {
            game.logger.playerDodgesHole(game.player)
          } else {
            game.logger.creatureDodgesHole(sees, game.player, creature)
          }
        },
        (sees, isPlayer) => {
          let fallEvent = this.fallEvent(game, levelMap),
            hurtEvent: CreatureEvent | undefined = new HurtEvent(
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

          if (isPlayer) {
            if (fallEvent) {
              game.logger.playerActivatedHole(game.player)
            } else {
              game.logger.playerActivatedShallowHole(game.player)
              fallEvent = new StayEvent(levelMap)
              hurtEvent = undefined
            }
          } else {
            if (fallEvent) {
              game.logger.creatureActivatedHole(sees, game.player, creature)
            } else {
              game.logger.creatureActivatedShallowHole(
                sees,
                game.player,
                creature
              )

              fallEvent = new StayEvent(levelMap)
              hurtEvent = undefined
            }
          }

          if (hurtEvent) {
            creature.on(fallEvent)
            return creature.on(hurtEvent)
          }

          return creature.on(fallEvent)
        }
      )
    )
  }

  private fallEvent(game: Game, levelMap: LevelMap): CreatureEvent | undefined {
    let event = undefined

    withEachTile(
      levelMap,
      tile => tile instanceof StairwayDown,
      tile => {
        if (tile instanceof StairwayDown) {
          let downLevelMap = game.getMap(tile.adjacentMapId),
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
