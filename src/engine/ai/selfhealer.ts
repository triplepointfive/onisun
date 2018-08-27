import { Creature } from '../models/creature'
import { AI } from './internal'
import { Game } from '../models/game'

export class SelfHealer extends AI {
  public act(actor: Creature, game: Game): boolean {
    if (actor.characteristics.health.atMax()) {
      return false
    }

    return true
  }
}
