import { Trap, Tile } from '../tile'
import { Game } from '../game'
import { LevelMap } from '../level_map'
import { Creature } from '../creature'

import { TrapEvent, TeleportationEvent } from '../../../engine'

export enum TrapType {
  Teleportation,
}

export class TeleportationTrap extends Trap {
  constructor(revealed: boolean = false) {
    super(revealed, TrapType.Teleportation)
  }

  protected buildNew(): Tile {
    return new TeleportationTrap(this.revealed)
  }

  protected affect(game: Game, levelMap: LevelMap, creature: Creature): void {
    creature.on(
      new TrapEvent(
        this,
        this.revealed ? 3 : 10,
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
          return creature.on(new TeleportationEvent(levelMap, game, false))
        }
      )
    )
  }
}
