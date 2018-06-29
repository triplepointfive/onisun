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
import { Point } from '../utils'

export class Thrower extends AI {
  public victim: Creature
  public previousVictim: Creature
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
      this.previousVictim = undefined
    }
  }

  private hasMissile(actor: Creature): boolean {
    this.missiles = actor.inventory.inSlot(Usage.Throw)
    return this.missiles.length > 0
  }

  private canAttack(actor: Creature): boolean {
    this.previousVictim = this.victim
    this.victim = undefined

    if (this.previousVictim) {
      if (
        this.findCreature(
          actor,
          creature => this.previousVictim.id === creature.id
        )
      ) {
        return true
      }
    }

    return this.findCreature(actor, creature => this.enemies(actor, creature))
  }

  private findCreature(
    actor: Creature,
    condition: (creature: Phantom) => boolean
  ): boolean {
    this.withinView(actor, (point, tile) => {
      const creature = tile.creature()

      if (
        !this.victim &&
        creature &&
        condition(creature) &&
        this.noObstacles(actor, point)
      ) {
        this.victim = actor.currentLevel.at(point.x, point.y).creature.real()
      }
    })

    return !!this.victim
  }

  private noObstacles(actor: Creature, target: Point): boolean {
    let [x0, x1, y0, y1] = [actor.pos.x, target.x, actor.pos.y, target.y]
    let steps = Math.max(Math.abs(x0 - x1), Math.abs(y0 - y1))
    const delta = new Point((x1 - x0) / steps, (y1 - y0) / steps)

    while (steps > 1) {
      x0 += delta.x
      y0 += delta.y

      if (
        actor
          .stageMemory()
          .at(Math.round(x0), Math.round(y0))
          .tangible(actor)
      ) {
        return false
      }

      steps -= 1
    }

    return true
  }
}
