import { AI } from './internal'
import { Creature, Ability, Phantom, Reaction } from '../creature'
import { GroupedItem } from '../items/internal'
import { Point, bresenham } from '../utils'
import { ItemFlightEffect } from '../effect'
import { ThrowEvent } from '../event';

export class Thrower extends AI {
  public victim: Creature
  public previousVictim: Creature
  public missiles: GroupedItem

  public available(actor: Creature): boolean {
    return (
      actor.can(Ability.Throwing) &&
      this.hasMissile(actor) &&
      this.canAttack(actor)
    )
  }

  public act(actor: Creature): void {
    const missile = this.missiles.item
    actor.inventory.missileSlot.removeItem(actor, 1)

    let path = []

    bresenham(actor.pos, this.victim.pos, (x, y) => path.push(new Point(x, y)))

    const effect = new ItemFlightEffect(missile, path, () => {
      if (this.victim.on(new ThrowEvent(actor, missile)) === Reaction.DIE) {
        this.victim = undefined
        this.previousVictim = undefined
      }
    })

    actor.currentLevel.addEffect(effect)
  }

  private hasMissile(actor: Creature): boolean {
    this.missiles = actor.inventory.missileSlot.equipment
    return this.missiles !== undefined
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
        !this.obstacles(actor, point)
      ) {
        this.victim = actor.currentLevel.at(point.x, point.y).creature.real()
      }
    })

    return !!this.victim
  }

  private obstacles(actor: Creature, target: Point): boolean {
    let obstacles = false

    bresenham(actor.pos, target, (x, y) => {
      obstacles =
        obstacles ||
        actor
          .stageMemory()
          .at(x, y)
          .tangible(actor)
    })

    return obstacles
  }
}
