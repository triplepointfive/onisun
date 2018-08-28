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

  public act(actor: Creature, game: Game): CreatureEvent | undefined {
    this.step += 1

    if (this.step % actor.characteristics.regenerateEvery() === 0) {
      actor.characteristics.regenerate()
    }

    this.runEvents()
    let event: CreatureEvent | undefined

    if (this.feelsGood(actor)) {
      if ((event = this.attacker.act(actor, game))) {
      } else if ((event = this.thrower.act(actor, game))) {
      } else if ((event = this.chaser.act(actor, game))) {
      } else if ((event = this.picker.act(actor, game))) {
      } else {
        event = this.explore(actor, game)
      }
    } else if (
      this.healthCritical(actor) &&
      (event = this.escaper.act(actor, game))
    ) {
    } else if ((event = this.attacker.act(actor, game))) {
    } else if ((event = this.thrower.act(actor, game))) {
    } else if ((event = this.chaser.act(actor, game))) {
    } else {
      event = new SelfHealer().act(actor, game)
    }

    this.resetEvents()

    return event
  }

  private feelsGood(actor: Creature): boolean {
    return (
      actor.characteristics.health.currentValue() >
      actor.characteristics.health.maximum() * 0.9
    )
  }

  private healthCritical(actor: Creature): boolean {
    return (
      actor.characteristics.health.currentValue() <
      actor.characteristics.health.maximum() / 4
    )
  }

  private explore(actor: Creature, game: Game): CreatureEvent | undefined {
    let event: CreatureEvent | undefined

    if ((event = this.explorer.act(actor, game))) {
      if (!actor.dead) {
        this.patrol.trackMovement(
          game.currentMap.creaturePos(actor),
          game.currentMap.creatureTile(actor)
        )
      }
    } else if ((event = this.descender.act(actor, game))) {
    } else if ((event = this.patrol.act(actor, game))) {
    } else {
      event = this.loiter.act(actor, game)
    }

    return event
  }
}
