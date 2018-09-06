import { Trap, Tile } from '../tile'

import { Game } from '../game'

import { LevelMap } from '../level_map'

import { Creature } from '../creature'

import {
  Calculator,
  MessageCreatureEvent,
  TrapEvent,
  TeleportationEvent,
} from '../../../engine'

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
    console.log(creature.bodyControl, this.revealed ? 3 : 10)
    if (Calculator.dodges(creature.bodyControl, this.revealed ? 5 : 10)) {
      creature.on(
        new MessageCreatureEvent(
          levelMap,
          game,
          () => game.logger.creatureDodgesTeleportationTrap(creature),
          () => game.logger.playerDodgesTeleportationTrap()
        )
      )
    } else {
      creature.on(
        new TrapEvent(
          this,
          new TeleportationEvent(levelMap, game, false),
          levelMap,
          game
        )
      )
    }
  }
}
