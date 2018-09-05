import {
  TrapEvent,
  Creature,
  Tile,
  Trap,
  Game,
  LevelMap,
  TeleportationEvent,
} from '../../engine'

export enum OnisunTrapType {
  Teleportation,
}

export class OnisunTeleportationTrap extends Trap {
  constructor(revealed: boolean = false) {
    super(revealed, OnisunTrapType.Teleportation)
  }

  protected buildNew(): Tile {
    return new OnisunTeleportationTrap(this.revealed)
  }

  protected affect(game: Game, levelMap: LevelMap, creature: Creature): void {
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
