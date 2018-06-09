import { AI } from './internal'
import { Phantom, Creature, Event, EventType, Reaction } from '../creature'
import { Point } from '../utils'

export class Attacker extends AI {
  private victim?: Creature

  public available(actor: Creature): boolean {
    return this.canAttack(actor)
  }

  public act(actor: Creature, firstTurn: boolean = true): void {
    if (this.victimSet() && this.victimInAccess(actor)) {
      this.attack(actor)
    } else {
      if (!firstTurn) {
        throw 'Attacker got called twice'
      }

      this.findNewVictim(actor)
      this.act(actor, false)
    }
  }

  protected attack(actor: Creature) {
    if (this.victim.on(actor.emit(EventType.Attack)) === Reaction.DIE) {
      this.victim = undefined
    }
  }

  private canAttack(actor: Creature): boolean {
    const memory = actor.stageMemory()
    return actor.pos
      .wrappers()
      .some(({ x, y }) => memory.at(x, y).creature() !== undefined)
  }

  private victimInAccess(actor: Creature): boolean {
    const memory = actor.stageMemory()
    return actor.pos
      .wrappers()
      .some(
        ({ x, y }) =>
          memory.at(x, y).creature() &&
          memory.at(x, y).creature().id === this.victim.id
      )
  }

  private victimSet(): boolean {
    return this.victim !== undefined
  }

  private updateVictimPosition(actor: Creature) {
    this.findCreature(actor, creature => creature.id === this.victim.id)
  }

  private findNewVictim(actor: Creature) {
    this.findCreature(actor, creature => creature.id !== actor.id)
  }

  private findCreature(
    actor: Creature,
    condition: (creature: Phantom) => boolean
  ): boolean {
    this.withinView(actor, ({ x, y }, tile) => {
      const creature = tile.creature()

      if (creature && condition(creature)) {
        this.victim = creature.real()
        return true
      }
    })

    return false
  }
}
