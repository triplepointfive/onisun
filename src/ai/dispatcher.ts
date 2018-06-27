import {
  AI,
  Attacker,
  Chaser,
  Escaper,
  Explorer,
  Loiter,
  Picker,
  Patrol,
  SelfHealer,
  Descender,
  Thrower,
} from '../ai'
import { Creature } from '../creature'
import { MetaAI, AIEventType } from './meta_ai'
import { Wearer } from './wearer'

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

  private firstCallPatrol: boolean = true

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

  public act(actor: Creature, firstTurn: boolean = true): void {
    // Never dispatch twice
    if (!firstTurn) {
      throw 'Meta AI called recursively'
    }

    this.step += 1

    if (this.step % actor.characteristics.regenerateEvery() === 0) {
      actor.characteristics.regenerate()
    }

    this.events.forEach(event => {
      switch (event.type) {
        case AIEventType.ItemPickedUp:
          new Wearer(this).act(actor)
      }
    })

    if (this.feelsGood(actor)) {
      if (this.attacker.available(actor)) {
        this.setAi(this.attacker)
      } else if (this.thrower.available(actor)) {
        this.setAi(this.thrower)
      } else if (this.chaser.available(actor)) {
        this.setAi(this.chaser)
      } else if (this.seesItems(actor)) {
        this.pickItem(actor)
      } else {
        this.explore(actor)
      }
    } else if (this.healthCritical(actor) && this.escaper.available(actor)) {
      this.setAi(this.escaper)
    } else if (this.attacker.available(actor)) {
      this.setAi(this.attacker)
    } else if (this.thrower.available(actor)) {
      this.setAi(this.thrower)
    } else if (this.chaser.available(actor)) {
      this.setAi(this.chaser)
    } else {
      this.rest(actor)
    }

    this.resetEvents()
    this.aiToRun.act(actor, firstTurn)
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

  private seesItems(actor: Creature): boolean {
    return this.picker.available(actor)
  }

  private pickItem(actor: Creature): void {
    this.setAi(this.picker)
  }

  private explore(actor: Creature): void {
    if (this.explorer.available(actor)) {
      this.patrol.trackMovement(actor)
      this.setAi(this.explorer)
    } else if (this.descender.available(actor)) {
      this.setAi(this.descender)
    } else if (this.patrol.available(actor)) {
      if (this.firstCallPatrol) {
        this.firstCallPatrol = false
        this.patrol.addNode(actor.pos.x, actor.pos.y)
      }
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
