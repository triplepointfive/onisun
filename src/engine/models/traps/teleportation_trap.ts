import { Trap, Tile, TrapType } from '../tile'
import { Game } from '../game'
import { LevelMap } from '../level_map'
import { Creature } from '../creature'

import { TrapEvent, TeleportationEvent, Point } from '../../../engine'
import { Player } from '../player'

export class TeleportationTrap extends Trap {
  constructor(tile: Tile, revealed: boolean = false) {
    super(TrapType.Teleportation, tile, revealed)
  }

  public untrap(
    pos: Point,
    player: Player,
    levelMap: LevelMap,
    game: Game
  ): void {
    game.logger.canNotUntrap()
  }

  protected buildNew(): Tile {
    return new TeleportationTrap(this.tile, this.revealed)
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
