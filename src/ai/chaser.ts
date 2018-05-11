import { AI } from './internal'
import { Creature, CreatureId } from '../creature'
import { Point } from '../utils'

export class Chaser extends AI {
  private victimPos?: Point

  constructor(
    private victimId?: CreatureId,
  ) {
    super()
  }

  public available(actor: Creature): boolean {
    return true
  }

  public act(actor: Creature): void {
    if (this.victimSet()) {
      this.updateVictimPosition(actor)
      this.chase(actor)
    } else if (this.foundNewVictim(actor)) {
      this.chase(actor)
    }

    if (this.victimSet() && this.caught(actor)) {
      this.resetVictim()
      // TODO: Loit here
    } else {
      // TODO: Loit here
    }
  }

  private victimSet(): boolean {
    return !!this.victimId
  }

  private updateVictimPosition(actor: Creature) {
    return this.findCreature(
      actor,
      creature => creature.id === this.victimId,
    )
  }

  private chase(actor: Creature): void {
    this.followTo(actor, this.victimPos)
  }

  private foundNewVictim(actor: Creature): boolean {
    return this.findCreature(
      actor,
      creature => creature.id !== actor.id
    )
  }

  private caught(actor: Creature): boolean {
    return actor.pos.nextTo(this.victimPos)
  }

  private resetVictim(): void {
    this.victimId = undefined
    this.victimPos = undefined
  }

  private findCreature(
    actor: Creature,
    condition: (creature: Creature) => boolean,
  ): boolean {
    const field = actor.stageMemory()

    for (let y = 0; y < field.height; y++) {
      for (let x = 0; x < field.width; x++) {
        const creature = field.at(x, y).creature()

        if (creature && creature.id !== actor.id) {
          this.victimPos = new Point(x, y)
          this.victimId = creature.id
          return true
        }
      }
    }

    return false
  }
}
