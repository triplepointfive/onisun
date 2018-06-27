import { AI } from './internal'
import {
  Creature,
  Ability,
  CreatureId,
  Phantom,
  Reaction,
  ThrowEvent,
} from '../creature'
import { Usage, Equipment } from '../items/internal'

export class Thrower extends AI {
  protected victimId?: CreatureId
  protected victim: Creature
  public missiles: Equipment[]

  public available(actor: Creature): boolean {
    return (
      actor.can(Ability.Throwing) &&
      this.hasMissile(actor) &&
      this.canAttack(actor)
    )
  }

  public act(actor: Creature): void {
    const missile = this.missiles.pop()

    actor.inventory.takeOff(actor, missile)
    actor.inventory.removeFromBag(missile)

    if (this.victim.on(new ThrowEvent(actor, missile)) === Reaction.DIE) {
      this.victim = undefined
    }
  }

  private hasMissile(actor: Creature): boolean {
    this.missiles = actor.inventory.inSlot(Usage.Throw)
    return this.missiles.length > 0
  }

  private canAttack(actor: Creature): boolean {
    if (this.victim) {
      if (
        this.findCreature(actor, creature => this.victim.id === creature.id)
      ) {
        return true
      }
    }

    this.victim = undefined

    return this.findCreature(actor, creature => this.enemies(actor, creature))
  }

  private findCreature(
    actor: Creature,
    condition: (creature: Phantom) => boolean
  ): boolean {
    this.withinView(actor, (point, tile) => {
      const creature = tile.creature()

      if (!this.victim && creature && condition(creature)) {
        this.victim = actor.currentLevel.at(point.x, point.y).creature.real()
      }
    })

    return !!this.victim
  }
}
