import { AI } from './internal'
import { Creature } from '../creature'
import { Item } from '../items/internal'

export enum AIEventType {
  ItemPickedUp,
}

export class AIEvent {
  constructor(public type: AIEventType) {}
}
export class AIItemPickedEvent extends AIEvent {
  constructor(public items: Item[]) {
    super(AIEventType.ItemPickedUp)
  }
}

export abstract class MetaAI extends AI {
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
