import { AI } from './internal'
import { Creature } from '../creature'
import { ItemsBunch } from '../items/internal'

export enum AIEventType {
  ItemPickedUp,
}

export class AIEvent {
  constructor(public type: AIEventType) {}
}
export class AIItemPickedEvent extends AIEvent {
  constructor(public items: ItemsBunch) {
    super(AIEventType.ItemPickedUp)
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
