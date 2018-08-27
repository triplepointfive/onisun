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
import { AI } from './internal'
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

  public act(actor: Creature, game: Game, firstTurn: boolean = true): void {
    // Never dispatch twice
    if (!firstTurn) {
      throw 'Meta AI called recursively'
    }

    this.step += 1

    if (this.step % actor.characteristics.regenerateEvery() === 0) {
      actor.characteristics.regenerate()
    }

    this.runEvents()

    if (this.feelsGood(actor)) {
      if (this.attacker.available(actor, game)) {
        this.setAi(this.attacker)
      } else if (this.thrower.available(actor, game)) {
        this.setAi(this.thrower)
      } else if (this.chaser.available(actor, game)) {
        this.setAi(this.chaser)
      } else if (this.picker.available(actor, game)) {
        this.pickItem(actor)
      } else {
        this.explore(actor, game)
      }
    } else if (
      this.healthCritical(actor) &&
      this.escaper.available(actor, game)
    ) {
      this.setAi(this.escaper)
    } else if (this.attacker.available(actor, game)) {
      this.setAi(this.attacker)
    } else if (this.thrower.available(actor, game)) {
      this.setAi(this.thrower)
    } else if (this.chaser.available(actor, game)) {
      this.setAi(this.chaser)
    } else {
      this.rest(actor)
    }

    this.resetEvents()

    if (!this.aiToRun) {
      throw 'Dispatcher: no AI picked'
    }

    this.aiToRun.act(actor, game, firstTurn)
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

  private pickItem(actor: Creature): void {
    this.setAi(this.picker)
  }

  private explore(actor: Creature, game: Game): void {
    if (this.explorer.available(actor, game)) {
      this.patrol.trackMovement(
        actor,
        game.currentMap.creaturePos(actor),
        game.currentMap.creatureTile(actor)
      )
      this.setAi(this.explorer)
    } else if (this.descender.available(actor, game)) {
      this.setAi(this.descender)
    } else if (this.patrol.available(actor)) {
      this.setAi(this.patrol)
    } else {
      this.setAi(this.loiter)
    }
  }

  private rest(actor: Creature): void {
    this.setAi(new SelfHealer(this))
  }

  private setAi(ai: AI): void {
    if (this.aiToRun && this.aiToRun.id !== ai.id) {
      this.aiToRun.reset()
    }

    this.aiToRun = ai
  }
}
