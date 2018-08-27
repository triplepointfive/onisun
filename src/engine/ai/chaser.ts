import { Creature, CreatureId } from '../models/creature'
import { Game } from '../models/game'
import { Point } from '../utils/utils'
import { FollowTargetAI } from './internal'

export class Chaser extends FollowTargetAI {
  private victimId?: CreatureId

  public reset(): void {
    super.reset()
    this.victimId = undefined
  }

  protected foundNewTarget(actor: Creature, game: Game): boolean {
    // Is there a victim and a path to it?
    return (
      (this.victimSet() && this.buildVictimPath(actor, game)) ||
      this.foundNewVictim(actor, game)
    )
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

  protected goTo(actor: Creature, game: Game): boolean {
    if (!this.destination) {
      throw 'Chaser.goTo: no destination'
    }
    return this.followTo(actor, this.destination, game.currentMap, game)
  }

  private buildVictimPath(actor: Creature, game: Game): boolean {
    return this.findCreature(
      actor,
      game,
      creature => creature.id === this.victimId
    )
  }

  private foundNewVictim(actor: Creature, game: Game): boolean {
    // Found new victim and built path to it
    return (
      this.findCreature(actor, game, creature =>
        this.enemies(actor, creature)
      ) && this.buildVictimPath(actor, game)
    )
  }

  private findCreature(
    actor: Creature,
    game: Game,
    condition: (creature: Creature) => boolean
  ): boolean {
    let result: boolean = false

    this.withinView(
      actor.stageMemory(game.currentMap),
      game.currentMap.creaturePos(actor),
      ({ x, y }, tile) => {
        const creature = tile.creature

        if (!result && creature && condition(creature)) {
          this.destination = new Point(x, y)
          this.victimId = creature.id
          result = true
        }
      }
    )

    return result
  }
}
