import { Creature } from '../models/creature'
import { MetaAI } from './meta_ai'
import { Escaper } from './escaper'
import { Explorer } from './explorer'
import { Chaser } from './chaser'
import { Attacker } from './attacker'
import { Picker } from './picker'
import { Patrol } from './patrol'
import { Loiter } from './loiter'
import { Thrower } from './thrower'
import { Descender } from './descender'
import { SelfHealer } from './selfhealer'
import { Game } from '../models/game'
import { CreatureEvent } from '../events/internal'
import { LevelMap } from '../models/level_map'

export class Dispatcher extends MetaAI {
  private escaper: Escaper
  private explorer: Explorer
  private chaser: Chaser
  private attacker: Attacker
  private picker: Picker
  private patrol: Patrol
  private loiter: Loiter
  private thrower: Thrower

  private descender: Descender

  private step: number = 0

  constructor() {
    super()
    this.escaper = new Escaper()
    this.explorer = new Explorer()
    this.chaser = new Chaser()
    this.attacker = new Attacker()
    this.picker = new Picker()
    this.patrol = new Patrol()
    this.loiter = new Loiter()
    this.thrower = new Thrower()

    this.descender = new Descender()
  }

  public act(
    actor: Creature,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    this.step += 1

    if (this.step % actor.characteristics.regenerateEvery() === 0) {
      actor.characteristics.regenerate()
    }

    this.runEvents()
    let event: CreatureEvent | undefined

    if (this.feelsGood(actor)) {
      if ((event = this.attacker.act(actor, levelMap, game))) {
      } else if ((event = this.thrower.act(actor, levelMap, game))) {
      } else if ((event = this.chaser.act(actor, levelMap, game))) {
      } else if ((event = this.picker.act(actor, levelMap, game))) {
      } else {
        event = this.explore(actor, levelMap, game)
      }
    } else if (
      this.healthCritical(actor) &&
      (event = this.escaper.act(actor, levelMap, game))
    ) {
    } else if ((event = this.attacker.act(actor, levelMap, game))) {
    } else if ((event = this.thrower.act(actor, levelMap, game))) {
    } else if ((event = this.chaser.act(actor, levelMap, game))) {
    } else {
      event = new SelfHealer().act(actor, levelMap, game)
    }

    this.resetEvents()

    return event
  }

  private feelsGood(actor: Creature): boolean {
    return (
      actor.characteristics.health.currentValue >
      actor.characteristics.health.maximum * 0.9
    )
  }

  private healthCritical(actor: Creature): boolean {
    return (
      actor.characteristics.health.currentValue <
      actor.characteristics.health.maximum / 4
    )
  }

  private explore(
    actor: Creature,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    let event: CreatureEvent | undefined

    if ((event = this.explorer.act(actor, levelMap, game))) {
      if (!actor.dead) {
        this.patrol.trackMovement(
          levelMap.creaturePos(actor),
          levelMap.creatureTile(actor)
        )
      }
    } else if ((event = this.descender.act(actor, levelMap, game))) {
    } else if ((event = this.patrol.act(actor, levelMap, game))) {
    } else {
      event = this.loiter.act(actor, levelMap, game)
    }

    return event
  }
}
