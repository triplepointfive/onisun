import { AI } from './internal'
import { Creature, Player } from '../creature'
import { ItemsBunch } from '../items/internal'
import { Direction } from '../utils';

export enum AIEventType {
  ItemPickedUp,
  Move,
}

export abstract class AIEvent {
  constructor(public type: AIEventType) {}

  public act(player: Player): void {}
}

export class AIItemPickedEvent extends AIEvent {
  constructor(public items: ItemsBunch) {
    super(AIEventType.ItemPickedUp)
  }
}

export class AIMoveEvent extends AIEvent {
  constructor(public direction: Direction) {
    super(AIEventType.Move)
  }

  public act(player: Player): void {
    player.move(player.pos.add(this.direction))
  }
}

export abstract class MetaAI extends AI {
  constructor(public aiToRun: AI = null) {
    super()
  }
  protected events: AIEvent[] = []

  public available(actor: Creature): boolean {
    return true
  }

  public pushEvent(event: AIEvent) {
    this.events.push(event)
  }

  protected resetEvents(): void {
    this.events = []
  }
}
