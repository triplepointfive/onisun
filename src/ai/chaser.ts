import { FollowTargetAI } from './internal'
import { Phantom, Creature, CreatureId } from '../creature'
import { Point } from '../utils'

export class Chaser extends FollowTargetAI {
  private victimId?: CreatureId

  public reset(): void {
    super.reset()
    this.victimId = undefined
  }

  protected foundNewTarget(actor: Creature): boolean {
    // Is there a victim and a path to it?
    return (this.victimSet() && this.buildVictimPath(actor)) || this.foundNewVictim(actor)
  }

  protected onCantMove(): void {
    this.victimId = undefined
  }

  protected onReach(): void {
    this.victimId = undefined
  }

  private victimSet(): boolean {
    return !!this.victimId
  }

  protected goTo(actor: Creature): boolean {
    return this.followTo(actor, this.destination)
  }

  private buildVictimPath(actor: Creature): boolean {
    return this.findCreature(actor, creature => creature.id === this.victimId)
  }

  private foundNewVictim(actor: Creature): boolean {
    // Found new victim and built path to it
    return this.findCreature(actor, creature => this.enemies(actor, creature)) && this.buildVictimPath(actor)
  }

  private findCreature(
    actor: Creature,
    condition: (creature: Phantom) => boolean
  ): boolean {
    let result: boolean = false

    this.withinView(actor, ({ x, y }, tile) => {
      const creature = tile.creature()

      if (creature && condition(creature)) {
        this.destination = new Point(x, y)
        this.victimId = creature.id
        result = true
      }
    })

    return result
  }
}
