import { AI } from './internal'

import { Creature } from '../creature'

export class Chaser extends AI {
  act( walker: Creature ): void {

  }

  public available(actor: Creature): boolean {
    return true
  }
}
