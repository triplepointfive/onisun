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
} from '../ai'
import { Creature } from '../creature'

export class Dispatcher extends AI {
  private escaper: Escaper
  private explorer: Explorer
  private chaser: Chaser
  private attacker: Attacker
  private picker: Picker
  private patrol: Patrol
  private loiter: Loiter

  private firstCallPatrol: boolean = true

  constructor() {
    super()
    this.escaper = new Escaper(this)
    this.explorer = new Explorer(this)
    this.chaser = new Chaser(this)
    this.attacker = new Attacker(this)
    this.picker = new Picker(this)
    this.patrol = new Patrol(this)
    this.loiter = new Loiter(this)
  }

  public available(actor: Creature): boolean {
    return true
  }

  public act(actor: Creature, firstTurn: boolean = true): void {
    // Never dispatch twice
    if (!firstTurn) {
      throw 'Meta AI called recursively'
    }

    if (this.feelsGood(actor)) {
      if (this.enemyClose(actor)) {
        this.attack(actor)
      } else if (this.seesItems(actor)) {
        this.pickItem(actor)
      } else {
        this.explore(actor)
      }
    } else if (this.enemyClose(actor)) {
      if (this.healthCritical(actor)) {
        this.runAway(actor)
      } else {
        this.attack(actor)
      }
    } else {
      this.rest(actor)
    }

    this.prevAI.act(actor, firstTurn)
  }

  private feelsGood(actor: Creature): boolean {
    return actor.characteristics.health.currentValue() > actor.characteristics.health.maximum() * 0.9
  }

  private healthCritical(actor: Creature): boolean {
    return actor.characteristics.health.currentValue() < actor.characteristics.health.maximum() / 4
  }

  private enemyClose(actor: Creature): boolean {
    return this.escaper.available(actor)
  }

  private seesItems(actor: Creature): boolean {
    return this.picker.available(actor)
  }

  private attack(actor: Creature): void {
    if (this.attacker.available(actor)) {
      this.prevAI = this.attacker
    } else {
      this.prevAI = this.chaser
    }
  }

  private pickItem(actor: Creature): void {
    this.prevAI = this.picker
  }

  private explore(actor: Creature): void {
    if (this.explorer.available(actor)) {
      this.patrol.trackMovement(actor)
      this.prevAI = this.explorer
    } else if (this.patrol.available(actor)) {
      if (this.firstCallPatrol) {
        this.firstCallPatrol = false
        this.patrol.addNode(actor.pos.x, actor.pos.y)
      }
      this.prevAI = this.patrol
    } else {
      this.prevAI = this.loiter
    }
  }

  private runAway(actor: Creature): void {
    this.prevAI = this.escaper
  }

  private rest(actor: Creature): void {
    this.prevAI = new SelfHealer(this)
  }
}
