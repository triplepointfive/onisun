import { Trap, TrapType, Tile } from '../tile'
import { Point, TrapEvent, Calculator, Item } from '../../../engine'
import { Player } from '../player'
import { LevelMap } from '../level_map'
import { Game } from '../game'
import { Creature, Reaction } from '../creature'
import { HurtEvent } from '../../events/hurt_event'
import { DieReason } from '../../events/die_event'
import { Damage, DamageType } from '../../lib/damage'
import { Logger } from '../logger'

export class FallingRockTrap extends Trap {
  constructor(
    private newRock: () => Item,
    tile: Tile,
    revealed: boolean = false,
    public missilesCount = 5
  ) {
    super(TrapType.FallingRock, tile, revealed)
  }

  public buildNew(): Trap {
    return new FallingRockTrap(
      this.newRock,
      this.tile,
      this.revealed,
      this.missilesCount
    )
  }

  get dodgeRatio(): number {
    return this.revealed ? 3 : 12
  }

  get damages(): Damage[] {
    return [{ type: DamageType.Blunt, extra: 3, dice: { times: 2, max: 5 } }]
  }

  public untrap(
    pos: Point,
    player: Player,
    levelMap: LevelMap,
    game: Game
  ): void {
    if (Calculator.chance(1, 4)) {
      game.logger.failedToUntrap(player)

      const creature = levelMap.at(pos.x, pos.y).creature
      if (creature) {
        this.activate(pos, game, levelMap, creature)
      } else {
        this.throwMissile(pos, levelMap, game.logger)
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
    if (!this.throwMissile(pos, levelMap, game.logger)) {
      return Reaction.NOTHING
    }

    return creature.on(
      new TrapEvent(
        this,
        levelMap,
        game,
        (sees, isPlayer) =>
          game.logger.fallingTrapDodge(game.player, sees, isPlayer, creature),
        (sees, isPlayer) => {
          if (isPlayer && game.player.inventory.headSlot.firm) {
            game.logger.fallingTrapRests(game.player)
            return Reaction.RESIST
          }

          const res = creature.on(
            new HurtEvent(this.damages, DieReason.Trap, levelMap, game)
          )

          game.logger.fallingTrapActivate(
            game.player,
            sees,
            isPlayer,
            res,
            creature
          )

          return res
        }
      )
    )
  }

  protected throwMissile(
    pos: Point,
    levelMap: LevelMap,
    logger: Logger
  ): boolean {
    if (this.missilesCount <= 0) {
      logger.fallingTrapRanOut()
      return false
    }

    this.missilesCount -= 1

    levelMap.at(pos.x, pos.y).addItem(this.newRock(), 1)

    return true
  }
}
