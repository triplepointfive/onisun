import { Trap, TrapType, Tile } from '../tile'
import { Game } from '../game'
import { LevelMap } from '../level_map'
import { Creature } from '../creature'
import { TrapEvent } from '../../events/trap_event'
import { Point } from '../../utils/utils'

export class LightTrap extends Trap {
  constructor(revealed: boolean = false) {
    super(revealed, TrapType.Light)
  }

  public untrap(pos: Point, levelMap: LevelMap, game: Game): void {
    game.logger.canNotUntrap()
  }

  protected buildNew(): Tile {
    return new LightTrap(this.revealed)
  }

  protected affect(game: Game, levelMap: LevelMap, creature: Creature): void {
    creature.on(
      new TrapEvent(
        this,
        5,
        levelMap,
        game,
        (sees, isPlayer) => {
          if (isPlayer) {
            game.logger.playerDodgesTeleportationTrap()
          } else if (sees) {
            game.logger.creatureDodgesTeleportationTrap(creature)
          }
        },
        (sees, isPlayer) => {
          //return creature.on(new TeleportationEvent(levelMap, game, false))
        }
      )
    )
  }
}
