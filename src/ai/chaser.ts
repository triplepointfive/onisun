import { AI } from './internal'
import { Phantom, Creature, CreatureId } from '../creature'
import { Point } from '../utils'

export class Chaser extends AI {
  private victimPos?: Point
  private victimId?: CreatureId

  public available(actor: Creature): boolean {
    return true
  }

  public act(actor: Creature): void {
    if (this.victimSet()) {
      this.updateVictimPosition(actor)
      this.chase(actor)
    } else if (this.foundNewVictim(actor)) {
      this.chase(actor)
    } else if (this.victimPos) {
      if (this.moveTo(actor, this.victimPos) && this.victimPos.eq(actor.pos)) {
        this.victimPos = undefined
      }
    }

    if (this.victimSet() && this.caught(actor)) {
      this.resetVictim()
      // TODO: Loit here
    } else {
      // TODO: Loit here
    }
  }

  private victimSet(): boolean {
    return this.victimId !== undefined
  }

  private updateVictimPosition(actor: Creature) {
    this.findCreature(actor, creature => creature.id === this.victimId)
  }

  private chase(actor: Creature): void {
    this.followTo(actor, this.victimPos)
  }

  private foundNewVictim(actor: Creature): boolean {
    return this.findCreature(actor, creature => creature.id !== actor.id)
  }

  private caught(actor: Creature): boolean {
    return actor.pos.nextTo(this.victimPos)
  }

  private resetVictim(): void {
    this.victimId = undefined
  }

  private findCreature(
    actor: Creature,
    condition: (creature: Phantom) => boolean
  ): boolean {
    this.withinView(actor, ({ x, y }, tile) => {
      const creature = tile.creature()

      if (creature && condition(creature)) {
        this.victimPos = new Point(x, y)
        this.victimId = creature.id
        return true
      }
    })

    return false
  }
}
