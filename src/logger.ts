import * as moment from 'moment'
import { Creature } from './creature'
import { Moment } from 'moment'
import { Item } from './items/internal'

export enum LogLevel {
  DEBUG,
  INFO,
  WARNING,
  DANGER,
}

export class LogMessage {
  constructor(
    public level: LogLevel,
    public ts: Moment,
    public message: string
  ) {}
}

export class Logger {
  public messages: LogMessage[] = []

  public hurtMessage(damage: number, actor: Creature, target: Creature) {
    this.debug(`${target.name()} got ${damage} damage from ${actor.name()}`)
  }

  public killMessage(damage: number, actor: Creature, target: Creature) {
    this.warning(
      `${target.name()} got ${damage} damage from ${actor.name()} causes them to die`
    )
  }

  public missMessage(actor: Creature, target: Creature) {
    this.debug(`${actor.name()} misses ${target.name()}!`)
  }

  public throwMissMessage(actor: Creature, target: Creature, missile: Item) {
    this.debug(
      `${actor.name()} throws ${missile.name} in ${target.name()}, but misses!`
    )
  }

  public throwKillMessage(
    damage: number,
    actor: Creature,
    target: Creature,
    missile: Item
  ) {
    this.warning(
      `${target.name()} got ${damage} damage from ${actor.name()} by ${
        missile.name
      } causes them to die`
    )
  }

  public throwHurtMessage(
    damage: number,
    actor: Creature,
    target: Creature,
    missile: Item
  ) {
    this.debug(
      `${target.name()} got ${damage} damage from ${actor.name()} by ${
        missile.name
      }`
    )
  }

  public ranIntoAnObstacle(): void {
    this.addMessage(LogLevel.DEBUG, 'You ran into a wall')
  }

  public howToHandle(): void {
    this.addMessage(LogLevel.DEBUG, "Don't know how to handle it")
  }

  protected debug(message: string): void {
    this.addMessage(LogLevel.DEBUG, message)
  }

  protected info(message: string): void {
    this.addMessage(LogLevel.INFO, message)
  }

  protected warning(message: string): void {
    this.addMessage(LogLevel.WARNING, message)
  }

  protected danger(message: string): void {
    this.addMessage(LogLevel.DANGER, message)
  }

  protected addMessage(level: LogLevel, message: string): void {
    this.messages.push(new LogMessage(level, moment(), message))
  }
}
