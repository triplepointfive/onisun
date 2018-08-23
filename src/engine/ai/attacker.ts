import { AttackEvent, Game } from '../../engine'
import { Creature, Reaction } from '../models/creature'
import { AI } from './internal'

export class Attacker extends AI {
  public victim?: Creature

  public available(actor: Creature): boolean {
    return this.canAttack(actor)
  }

  public act(actor: Creature, game: Game, firstTurn: boolean = true): void {
    if (this.victimInAccess(actor)) {
      this.attack(actor, game)
    } else {
      if (!firstTurn) {
        throw 'Attacker got called twice'
      }

      this.pickNewVictim(actor)
      this.act(actor, game, false)
    }
  }

  protected attack(actor: Creature, game: Game) {
    if (this.victim.on(new AttackEvent(actor, game)) === Reaction.DIE) {
      this.victim = undefined
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
    )
  }

  private findCreature(
    actor: Creature,
    condition: (creature: Creature) => boolean
  ): Creature {
    const memory = actor.stageMemory()
    return actor.pos
      .wrappers()
      .map(({ x, y }) => memory.at(x, y).creature())
      .find(creature => creature && condition(creature))
  }
}
