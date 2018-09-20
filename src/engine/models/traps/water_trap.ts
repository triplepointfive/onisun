import { Trap, TrapType, Tile } from '../tile'
import { Point, TrapEvent, Calculator, Reaction } from '../../../engine'
import { Game } from '../game'
import { LevelMap } from '../level_map'
import { Creature } from '../creature'
import { Player } from '../player'
import { DamageType, Damage } from '../../lib/damage'
import { WaterDamageEvent } from '../../events/water_damage_event'

export class WaterTrap extends Trap {
  constructor(tile: Tile, revealed: boolean = false) {
    super(TrapType.Water, tile, revealed)
  }

  public buildNew(): Trap {
    return new WaterTrap(this.tile, this.revealed)
  }

  get dodgeRatio(): number {
    return this.revealed ? 10 : 8
  }

  get damages(): Damage[] {
    return [{ type: DamageType.Pure, extra: 5, dice: { times: 2, max: 2 } }]
  }

  public untrap(
    pos: Point,
    player: Player,
    levelMap: LevelMap,
    game: Game
  ): void {
    if (Calculator.chance(3, 4)) {
      game.logger.failedToUntrap(player)

      // TODO: Activate on creature on trap or on player
      if (Calculator.chance(1, 4)) {
        this.activate(pos, game, levelMap, player)
      }
    } else {
      this.disarmTile(pos, player, levelMap, game)
    }
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
          game.logger.waterTrapDamage(
            game.player,
            sees,
            isPlayer,
            Reaction.DODGE,
            creature
          ),
        (sees, isPlayer) => {
          if (isPlayer) {
            game.logger.waterTrapActivated()
          }

          let reaction = creature.on(
            new WaterDamageEvent(this.damages, levelMap, game)
          )

          if (!isPlayer) {
            game.logger.waterTrapDamage(
              game.player,
              sees,
              isPlayer,
              reaction,
              creature
            )
          }

          return reaction
        }
      )
    )
  }
}
