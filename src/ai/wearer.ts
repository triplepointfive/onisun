import { AI } from './internal'
import { Creature } from '../creature';
import { Equipment, Usage } from '../items/internal';

export class Wearer extends AI {
  public available(actor: Creature): boolean {
    return true
  }

  public act(actor: Creature, firstTurn: boolean = true) {
    actor.inventory.cares().forEach(item => {
      if (item instanceof Equipment) {
        if (this.shouldWear(actor, item)) {
          actor.putOn(item)
        }
      }
    })
  }

  private shouldWear(actor: Creature, item: Equipment) {
    return true
    // const usagesWithWeight: [number, Usage][] = item.usages.map(usage => {
    //   return [1, usage]
    // })
  }
}
