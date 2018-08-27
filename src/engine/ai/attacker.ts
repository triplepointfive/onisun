import { AttackEvent, Game } from '../../engine'
import { Creature, Reaction } from '../models/creature'
import { AI } from './internal'
import { LevelMap } from '../models/level_map';

export class Attacker extends AI {
  public victim?: Creature

  public available(actor: Creature, game: Game): boolean {
    return this.canAttack(actor, game)
  }

  public act(actor: Creature, game: Game, firstTurn: boolean = true): void {
    if (this.victimInAccess(actor, game, this.victim)) {
      this.attack(actor, game)
    } else {
      if (!firstTurn) {
        throw 'Attacker got called twice'
      }

      this.pickNewVictim(actor, game)
      this.act(actor, game, false)
    }
  }

  protected attack(actor: Creature, game: Game) {
    // TODO: Remove it one day
    if (!this.victim) {
      throw 'Attacker.victim is not set'
    }

    if (this.victim.on(new AttackEvent(actor, game)) === Reaction.DIE) {
      this.victim = undefined
    }
  }

  private canAttack(actor: Creature, game: Game): boolean {
    const creature = this.findCreature(actor, game.currentMap, creature =>
      this.enemies(actor, creature)
    )
    return !!creature
  }

  private victimInAccess(actor: Creature, game: Game, victim: Creature | undefined): boolean {
    if (victim === undefined) {
      return false
    }

    const creature = this.findCreature(
      actor,
      game.currentMap,
      (creature: Creature) => creature.id === victim.id
    )
    return !!creature
  }

  private pickNewVictim(actor: Creature, game) {
    this.victim = this.findCreature(actor, game.currentMap, creature =>
      this.enemies(actor, creature)
    )
  }

  private findCreature(
    actor: Creature,
    levelMap: LevelMap,
    condition: (creature: Creature) => boolean
  ): Creature | undefined {
    const memory = actor.stageMemory(levelMap.id)

    return levelMap.creaturePos(actor)
      .wrappers()
      .map(({ x, y }) => memory.at(x, y).creature)
      .find((creature: Creature | undefined) => creature ? condition(creature) : false)
  }
}
