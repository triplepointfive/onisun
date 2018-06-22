import { AI } from './internal'
import { Phantom, Creature, EventType, Reaction } from '../creature'

export class Attacker extends AI {
  public victim?: Creature

  public available(actor: Creature): boolean {
    return this.canAttack(actor)
  }

  public act(actor: Creature, firstTurn: boolean = true): void {
    if (this.victimInAccess(actor)) {
      this.attack(actor)
    } else {
      if (!firstTurn) {
        throw 'Attacker got called twice'
      }

      this.pickNewVictim(actor)
      this.act(actor, false)
    }
  }

  protected attack(actor: Creature) {
    if (this.victim.on(actor.emit(EventType.Attack)) === Reaction.DIE) {
      this.victim = undefined
      actor.level.add(1)
    }
  }

  private canAttack(actor: Creature): boolean {
    const creature = this.findCreature(actor, creature =>
      this.enemies(actor, creature)
    )
    return !!creature
  }

  private victimInAccess(actor: Creature): boolean {
    if (this.victim === undefined) {
      return false
    }

    const creature = this.findCreature(
      actor,
      creature => creature.id === this.victim.id
    )
    return !!creature
  }

  private pickNewVictim(actor: Creature) {
    this.victim = this.findCreature(actor, creature =>
      this.enemies(actor, creature)
    ).real()
  }

  private findCreature(
    actor: Creature,
    condition: (creature: Phantom) => boolean
  ): Phantom {
    const memory = actor.stageMemory()
    return actor.pos
      .wrappers()
      .map(({ x, y }) => memory.at(x, y).creature())
      .find(creature => creature && condition(creature))
  }
}
