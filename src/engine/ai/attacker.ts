import { AttackEvent, Game } from '../../engine'
import { Creature } from '../models/creature'
import { AI } from './internal'
import { LevelMap } from '../models/level_map'
import { CreatureEvent } from '../events/internal'

export class Attacker extends AI {
  public victim?: Creature

  public act(
    actor: Creature,
    levelMap: LevelMap,
    game: Game,
    firstTurn: boolean = true
  ): CreatureEvent | undefined {
    if (!this.canAttack(actor, game)) {
      return
    }

    if (this.victim && this.victimInAccess(actor, game, this.victim)) {
      return new AttackEvent(this.victim, levelMap, game)
    } else {
      if (!firstTurn) {
        throw 'Attacker got called twice'
      }

      this.pickNewVictim(actor, game)
      return this.act(actor, levelMap, game, false)
    }
  }

  private canAttack(actor: Creature, game: Game): boolean {
    const creature = this.findCreature(actor, game.currentMap, creature =>
      this.enemies(actor, creature)
    )
    return !!creature
  }

  private victimInAccess(
    actor: Creature,
    game: Game,
    victim: Creature | undefined
  ): boolean {
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

  private pickNewVictim(actor: Creature, game: Game) {
    this.victim = this.findCreature(actor, game.currentMap, creature =>
      this.enemies(actor, creature)
    )
  }

  private findCreature(
    actor: Creature,
    levelMap: LevelMap,
    condition: (creature: Creature) => boolean
  ): Creature | undefined {
    const memory = actor.stageMemory(levelMap)

    return levelMap
      .creaturePos(actor)
      .wrappers()
      .map(({ x, y }) => memory.at(x, y).creature)
      .find(
        (creature: Creature | undefined) =>
          creature ? condition(creature) : false
      )
  }
}
