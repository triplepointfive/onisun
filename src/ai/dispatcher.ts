import {
  AI,
  Attacker,
  Chaser,
  Escaper,
  Explorer,
} from '../ai'
import { Creature } from '../creature'

export class Dispatcher extends AI {
  private events: Event[] = []

  private escaper:  Escaper
  private explorer: Explorer
  private chaser: Chaser
  private attacker: Attacker

  constructor() {
    super()
    this.escaper  = new Escaper(this)
    this.explorer = new Explorer(this)
    this.chaser   = new Chaser(this)
    this.attacker = new Attacker(this)
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
      } else {
        this.explore(actor)
      }
    } else if (this.enemyClose(actor)) {
      this.runAway(actor)
    } else {
      this.rest(actor)
    }

    this.events = []
  }

  private feelsGood(actor: Creature): boolean {
    return true /////////////////////
  }

  private enemyClose(actor: Creature): boolean {
    return this.escaper.available(actor)
  }

  private attack(actor: Creature): void {
    if (this.attacker.available(actor)) {
      this.attacker.act(actor)
    } else {
      this.chaser.act(actor)
    }
  }

  private explore(actor: Creature): void {
    this.explorer.act(actor)
  }

  private runAway(actor: Creature): void {
    this.escaper.act(actor)
  }

  private rest(actor: Creature): void {
  }
}
