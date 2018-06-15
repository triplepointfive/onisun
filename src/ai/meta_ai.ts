import { AI } from './internal'
import { Creature } from '../creature'
import { Item } from '../items/internal'

export enum AIEventType {
  ItemPickedUp
}

export interface AIEvent { type: AIEventType }
export interface ItemPickedEvent extends AIEvent { item: Item }

export abstract class MetaAI extends AI {
  protected events: AIEvent[] = []

  public available(actor: Creature): boolean {
    return true
  }

  public pushEvent(event: AIEvent) {
    this.events.push(event)
  }
}
