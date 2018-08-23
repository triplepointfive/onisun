import { AI } from './internal'
import { Creature, Ability, Reaction } from '../models/creature'
import { GroupedItem } from '../models/items'
import { Point, bresenham } from '../utils/utils'
import { MissileAttackEvent } from '../../engine'
import { Game } from '../models/game'

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

  public act(actor: Creature, game: Game): void {
    let path: Point[] = []

    bresenham(actor.pos, this.victim.pos, (x, y) => path.push(new Point(x, y)))

    actor.on(
      new MissileAttackEvent(path, game, (reaction: Reaction) => {
        if (reaction === Reaction.DIE) {
          this.victim = undefined
          this.previousVictim = undefined
        }
      })
    )
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
    condition: (creature: Creature) => boolean
  ): boolean {
    this.withinView(actor, (point, tile) => {
      const creature = tile.creature()

      if (
        !this.victim &&
        creature &&
        condition(creature) &&
        !this.obstacles(actor, point)
      ) {
        this.victim = actor.currentLevel.at(point.x, point.y).creature
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
