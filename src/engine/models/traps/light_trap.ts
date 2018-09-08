import { Trap, TrapType, Tile } from '../tile'
import { Game } from '../game'
import { LevelMap } from '../level_map'
import { Creature, Reaction } from '../creature'
import { TrapEvent } from '../../events/trap_event'
import { Point } from '../../utils/utils'
import { AddImpactEvent } from '../../events/add_impact_event'
import { ImpactType } from '../../lib/impact'
import { Calculator } from '../../lib/calculator'
import { Player } from '../player'

export class LightTrap extends Trap {
  constructor(tile: Tile, revealed: boolean = false) {
    super(TrapType.Light, tile, revealed)
  }

  public untrap(
    pos: Point,
    player: Player,
    levelMap: LevelMap,
    game: Game
  ): void {
    if (Calculator.chance(1, 3)) {
      game.logger.failedToUntrap(player)
      this.activate(game, levelMap, player)
    } else {
      this.disarmTile(pos, player, levelMap, game)
    }
  }

  protected buildNew(): Tile {
    return new LightTrap(this.tile, this.revealed)
  }

  public activate(game: Game, levelMap: LevelMap, creature: Creature): void {
    creature.on(
      new TrapEvent(
        this,
        this.revealed ? 1 : 10,
        levelMap,
        game,
        (sees, isPlayer) => {
          if (isPlayer) {
            game.logger.playerDodgesBlindTrap(game.player)
          } else if (sees) {
            game.logger.creatureLighted(game.player, creature)
          }
        },
        (sees, isPlayer) => {
          if (creature.hasImpact(ImpactType.Blind)) {
            return Reaction.NOTHING
          }

          if (isPlayer) {
            game.logger.playerActivatedLightTrap(game.player)
          } else {
            game.logger.creatureLighted(game.player, creature)
          }

          return creature.on(
            new AddImpactEvent(ImpactType.Blind, 'trap', game, 10)
          )
        }
      )
    )
  }
}
