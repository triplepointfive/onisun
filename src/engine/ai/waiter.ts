import { AI } from './internal'
import { Creature } from '../models/creature'

export class Waiter extends AI {
  act(actor: Creature): boolean { return true }
}
