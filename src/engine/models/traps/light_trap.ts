import { Trap, TrapType, Tile } from '../tile'
import { Game } from '../game'
import { LevelMap } from '../level_map'
import { Creature } from '../creature'
import { TrapEvent } from '../../events/trap_event'
import { Point } from '../../utils/utils'
import { AddImpactEvent } from '../../events/add_impact_event'
import { ImpactType } from '../../lib/impact'

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
        this.revealed ? 0 : 10,
        levelMap,
        game,
        (sees, isPlayer) => {
          // TODO: Light trap messages
          if (isPlayer) {
            game.logger.playerDodgesTeleportationTrap()
          } else if (sees) {
            game.logger.creatureDodgesTeleportationTrap(creature)
          }
        },
        (sees, isPlayer) => {
          return creature.on(
            new AddImpactEvent(ImpactType.Blind, 'trap', game, 10)
          )
        }
      )
    )
  }
}
