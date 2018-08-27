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
    this.escaper = new Escaper(this)
    this.explorer = new Explorer(this)
    this.chaser = new Chaser(this)
    this.attacker = new Attacker(this)
    this.picker = new Picker(this)
    this.patrol = new Patrol(this)
    this.loiter = new Loiter(this)
    this.thrower = new Thrower(this)

    this.descender = new Descender(this)
  }

  public act(actor: Creature, game: Game): boolean {
    this.step += 1

    if (this.step % actor.characteristics.regenerateEvery() === 0) {
      actor.characteristics.regenerate()
    }

    this.runEvents()

    if (this.feelsGood(actor)) {
      if (this.attacker.act(actor, game)) {
      } else if (this.thrower.act(actor, game)) {
      } else if (this.chaser.act(actor, game)) {
      } else if (this.picker.act(actor, game)) {
      } else {
        this.explore(actor, game)
      }
    } else if (
      this.healthCritical(actor) &&
      this.escaper.act(actor, game)
    ) {
    } else if (this.attacker.act(actor, game)) {
    } else if (this.thrower.act(actor, game)) {
    } else if (this.chaser.act(actor, game)) {
    } else {
      new SelfHealer(this).act(actor, game)
    }

    this.resetEvents()

    return true
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

  private explore(actor: Creature, game: Game): void {
    if (this.explorer.act(actor, game)) {
      if (!actor.dead) {
        this.patrol.trackMovement(
          actor,
          game.currentMap.creaturePos(actor),
          game.currentMap.creatureTile(actor)
        )
      }
    } else if (this.descender.act(actor, game)) {
    } else if (this.patrol.act(actor, game)) {
    } else {
      this.loiter.act(actor, game)
    }
  }
}
