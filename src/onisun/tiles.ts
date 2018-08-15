import { Tile, Trap, Game } from '../engine'
import { Creature, TrapEvent } from '../engine/creature'

export enum OnisunTrapType {
  Fire,
  Ice,
}

export class OnisunFireTrap extends Trap {
  constructor(revealed: boolean = false) {
    super(revealed, OnisunTrapType.Fire)
  }

  protected buildNew(): Tile {
    return new OnisunFireTrap(this.revealed)
  }

  protected affect(game: Game, creature: Creature): void {
    creature.on(new TrapEvent(this))
  }
}

export class OnisunIceTrap extends Trap {
  constructor(revealed: boolean = false) {
    super(revealed, OnisunTrapType.Ice)
  }

  protected buildNew(): Tile {
    return new OnisunIceTrap(this.revealed)
  }

  protected affect(game: Game, creature: Creature): void {
    creature.on(new TrapEvent(this))
  }
}
