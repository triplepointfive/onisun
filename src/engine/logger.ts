import * as moment from 'moment'
import { Creature } from './creature'
import { Moment } from 'moment'
import { Item, Potion } from './items/internal'

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

  public noItemsToPickUp(): void {
    this.addMessage(LogLevel.DEBUG, "You don't see anything to pick up")
  }

  public takeOff(item: Item): void {
    this.addMessage(LogLevel.DEBUG, `You took off ${item.name}`)
  }

  public putOn(item: Item): void {
    this.addMessage(LogLevel.DEBUG, `You put on ${item.name}`)
  }

  public drink(item: Potion): void {
    this.addMessage(LogLevel.INFO, `You drunk ${item.name}`)
  }

  public nothingToShotWith(): void {
    this.addMessage(LogLevel.DEBUG, 'You have nothing to shoot with')
  }

  public needMissileWeapon(): void {
    this.addMessage(LogLevel.DEBUG, 'Мне нужен лук или типа того')
  }

  public pickedUpItem(item: Item, count: number): void {
    if (count === 1) {
      this.addMessage(LogLevel.INFO, `You picked up ${item.name}`)
    } else {
      this.addMessage(LogLevel.INFO, `You picked up ${count} ${item.name}`)
    }
  }

  public droppedItem(item: Item, count: number): void {
    if (count === 1) {
      this.addMessage(LogLevel.INFO, `You dropped a ${item.name}`)
    } else {
      this.addMessage(LogLevel.INFO, `You dropped ${count} ${item.name}`)
    }
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
