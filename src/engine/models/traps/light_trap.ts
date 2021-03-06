import { Trap, TrapType, Tile } from '../tile'
import { Game } from '../game'
import { LevelMap } from '../level_map'
import { Creature } from '../creature'
import { TrapEvent } from '../../events/trap_event'
import { Point } from '../../utils/utils'
import { AddImpactEvent } from '../../events/add_impact_event'
import { ImpactType } from '../../lib/impact'
import { Calculator } from '../../lib/calculator'
import { Player } from '../player'
import { Reaction } from '../../../engine'

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
      // TODO: Activate on creature on trap or on player
      this.activate(pos, game, levelMap, player)
    } else {
      this.disarmTile(pos, player, levelMap, game)
    }
  }

  protected buildNew(): Tile {
    return new LightTrap(this.tile, this.revealed)
  }

  get dodgeRatio(): number {
    return this.revealed ? 1 : 10
  }

  get duration(): number {
    return 10
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
          game.logger.lightTrapDodge(game.player, sees, isPlayer, creature),
        (sees, isPlayer) => {
          // TODO: If player sees a creature log a message nevertheless
          if (creature.hasImpact(ImpactType.Blind)) {
            return Reaction.Nothing
          }

          game.logger.lightTrapActivated(game.player, sees, isPlayer, creature)

          return creature.on(
            new AddImpactEvent(ImpactType.Blind, 'trap', game, this.duration)
          )
        }
      )
    )
  }
}
