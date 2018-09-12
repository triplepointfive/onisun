import { Trap, TrapType, Tile } from '../tile'
import { Point } from '../../../engine'
import { Game } from '../game'
import { LevelMap } from '../level_map'
import { Reaction, Creature } from '../creature'
import { Player } from '../player'

export class WaterTrap extends Trap {
  constructor(tile: Tile, revealed: boolean = false) {
    super(TrapType.Water, tile, revealed)
  }

  public buildNew(): Trap {
    return new WaterTrap(this.tile, this.revealed)
  }

  get dodgeRatio(): number {
    return this.revealed ? 2 : 8
  }

  public untrap(
    pos: Point,
    player: Player,
    levelMap: LevelMap,
    game: Game
  ): void {
    throw new Error('Method not implemented.')
  }

  public activate(
    pos: Point,
    game: Game,
    levelMap: LevelMap,
    actor: Creature
  ): Reaction {
    // TODO: Do water damage to body parts those do not have water resistance
    throw new Error('Method not implemented.')
  }
}
