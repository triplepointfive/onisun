import { AI } from './internal'
import { Creature, Ability, Reaction, CreatureId } from '../models/creature'
import { GroupedItem } from '../models/items'
import { Point, bresenham } from '../utils/utils'
import { MissileAttackEvent } from '../../engine'
import { Game } from '../models/game'
import { LevelMap } from '../models/level_map'
import { Memory } from '../models/memory'
import { CreatureEvent } from '../events/internal'

export class Thrower extends AI {
  public victim: Creature | undefined
  public previousVictim: Creature | undefined
  public missiles: GroupedItem | undefined

  public act(actor: Creature, game: Game): CreatureEvent | undefined {
    if (
      !actor.can(Ability.Throwing) ||
      !this.hasMissile(actor) ||
      !this.canAttack(actor, game)
    ) {
      return
    }

    let path: Point[] = []

    if (!this.victim) {
      throw 'Thrower.act called when there is no victim'
    }

    bresenham(
      game.currentMap.creaturePos(actor),
      game.currentMap.creaturePos(this.victim),
      (x, y) => path.push(new Point(x, y))
    )

    return new MissileAttackEvent(
      path,
      game,
      game.currentMap,
      (reaction: Reaction) => {
        if (reaction === Reaction.DIE) {
          this.victim = undefined
          this.previousVictim = undefined
        }
      }
    )
  }

  private hasMissile(actor: Creature): boolean {
    this.missiles = actor.inventory.missileSlot.equipment
    return this.missiles !== undefined
  }

  private canAttack(actor: Creature, game: Game): boolean {
    this.previousVictim = this.victim
    this.victim = undefined

    if (this.previousVictim) {
      if (this.findWithId(actor, game.currentMap, this.previousVictim.id)) {
        return true
      }
    }

    return this.findCreature(actor, game.currentMap, creature =>
      this.enemies(actor, creature)
    )
  }

  private findWithId(
    actor: Creature,
    levelMap: LevelMap,
    victimId: CreatureId
  ): boolean {
    return this.findCreature(
      actor,
      levelMap,
      creature => victimId === creature.id
    )
  }

  private findCreature(
    actor: Creature,
    levelMap: LevelMap,
    condition: (creature: Creature) => boolean
  ): boolean {
    const memory = actor.stageMemory(levelMap),
      pos = levelMap.creaturePos(actor)

    this.withinView(memory, levelMap.creaturePos(actor), (point, tile) => {
      const creature = tile.creature

      if (
        !this.victim &&
        creature &&
        condition(creature) &&
        !this.obstacles(actor, pos, memory, point)
      ) {
        this.victim = levelMap.at(point.x, point.y).creature
      }
    })

    return !!this.victim
  }

  private obstacles(
    actor: Creature,
    pos: Point,
    memory: Memory,
    target: Point
  ): boolean {
    let obstacles = false

    bresenham(pos, target, (x, y) => {
      obstacles = obstacles || memory.at(x, y).tangible(actor)
    })

    return obstacles
  }
}
