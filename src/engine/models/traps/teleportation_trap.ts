import { Point, TeleportationEvent, TrapEvent } from '../../../engine'
import { Creature } from '../creature'
import { Game } from '../game'
import { LevelMap } from '../level_map'
import { Player } from '../player'
import { Tile, Trap, TrapType } from '../tile'

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

  public activate(game: Game, levelMap: LevelMap, creature: Creature): void {
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
