import { Creature, Reaction } from './creature'
import { Item, Potion } from './items'

import { last } from 'lodash'
import { Player } from './player'

export enum LogLevel {
  DEBUG,
  INFO,
  WARNING,
  DANGER,
}

export interface LogMessage {
  level: LogLevel
  message: string
  counter: number
}

// TODO: Do not display messages while being blind
export class Logger {
  public messages: LogMessage[] = []

  public reset() {
    this.messages = []
  }

  public hurtMessage(
    player: Player,
    damage: number,
    actor: Creature,
    target: Creature
  ) {
    this.debug(`${target.name} got ${damage} damage from ${actor.name}`)
  }

  public killMessage(
    player: Player,
    damage: number,
    actor: Creature,
    target: Creature
  ) {
    this.warning(
      `${target.name} got ${damage} damage from ${
        actor.name
      } causes them to die`
    )
  }

  public missMessage(player: Player, actor: Creature, target: Creature) {
    this.debug(`${actor.name} misses ${target.name}!`)
  }

  public throwMissMessage(
    player: Player,
    actor: Creature,
    target: Creature,
    missile: Item
  ) {
    this.debug(
      `${actor.name} throws ${missile.name} in ${target.name}, but misses!`
    )
  }

  public throwKillMessage(
    player: Player,
    damage: number,
    actor: Creature,
    target: Creature,
    missile: Item
  ) {
    this.warning(
      `${target.name} got ${damage} damage from ${actor.name} by ${
        missile.name
      } causes them to die`
    )
  }

  public throwHurtMessage(
    player: Player,
    damage: number,
    actor: Creature,
    target: Creature,
    missile: Item
  ) {
    this.debug(
      `${target.name} got ${damage} damage from ${actor.name} by ${
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

  public youSteppedInTrap(): void {
    this.addMessage(LogLevel.DANGER, 'Я наступил в ловушку')
  }

  public creatureSteppedInTrap(creature: Creature): void {
    this.addMessage(LogLevel.DANGER, `${creature.name} наступил в ловушку`)
  }

  public noDamageToPlayer(actor: Creature): void {
    this.addMessage(
      LogLevel.DEBUG,
      `${actor.name} ударил по мне, но я не почувствовал боли`
    )
  }

  public noDamageToTarget(actor: Creature): void {
    this.addMessage(
      LogLevel.DEBUG,
      `Удар пришелся по ${actor.name} но остался незамеченным`
    )
  }

  public playerIgnoresDamage(target: Creature): void {
    this.addMessage(LogLevel.DEBUG, `Я игнорирую урон ${target.name}`)
  }

  public targetIgnoresDamage(target: Creature): void {
    this.addMessage(LogLevel.INFO, `${target.name} игнорирует урон`)
  }

  public creatureTeleported(actor: Creature): void {
    this.addMessage(LogLevel.INFO, `${actor.name} иcчез`)
  }

  public creatureNotTeleported(actor: Creature): void {
    this.addMessage(
      LogLevel.INFO,
      `${actor.name} озарился светом, но ничего не произошло`
    )
  }

  public creatureDodgesTeleportationTrap(actor: Creature): void {
    this.addMessage(
      LogLevel.INFO,
      `${actor.name} попал в ловушку телепортации но смог увернуться`
    )
  }

  public creatureLighted(player: Player, actor: Creature): void {
    this.addMessage(
      LogLevel.INFO,
      `${actor.name} озарился яркой вспышкой света`
    )
  }

  public playerActivatedLightTrap(player: Player): void {
    this.addMessage(LogLevel.INFO, `Яркая вспышка света ослепила меня`)
  }

  public playerTeleportationCaused(): void {
    this.addMessage(LogLevel.INFO, `Что-то заставило меня телепортироваться`)
  }

  public playerTeleported(): void {
    this.addMessage(LogLevel.INFO, `Яркая вспышка и я оказался в другом месте`)
  }

  public playerNotTeleported(): void {
    this.addMessage(
      LogLevel.INFO,
      `Я озарился ярким светом, но ничего не произошло`
    )
  }

  public playerTeleportedWhereTheyWere(): void {
    this.addMessage(LogLevel.INFO, `Я решил никуда не телепортироваться`)
  }

  public playerDodgesTeleportationTrap(): void {
    this.addMessage(
      LogLevel.INFO,
      `Я попал в ловушку телепортации но смог увернуться`
    )
  }

  public playerDodgesBlindTrap(player: Player): void {
    this.addMessage(LogLevel.INFO, `Вспышка света чуть не ослепила меня`)
  }

  public playerDodgesHole(player: Player): void {
    this.addMessage(LogLevel.WARNING, `Я чуть не упал в яму`)
  }

  public creatureDodgesHole(
    sees: boolean,
    player: Player,
    actor: Creature
  ): void {
    if (sees) {
      this.addMessage(LogLevel.WARNING, `${actor.name} чуть не упал в яму`)
    }
  }

  public playerActivatedHole(player: Player): void {
    this.addMessage(LogLevel.WARNING, `Я упал в яму`)
  }

  public playerActivatedShallowHole(player: Player): void {
    this.addMessage(LogLevel.INFO, `Я упал в неглубокую яму`)
  }

  public creatureActivatedHole(
    sees: boolean,
    player: Player,
    actor: Creature
  ): void {
    if (sees) {
      this.addMessage(LogLevel.WARNING, `${actor.name} упал в яму`)
    }
  }

  public creatureActivatedShallowHole(
    sees: boolean,
    player: Player,
    actor: Creature
  ): void {
    if (sees) {
      this.addMessage(LogLevel.INFO, `${actor} упал в неглубокую яму`)
    }
  }

  public canNotUntrap(): void {
    this.addMessage(LogLevel.INFO, `Не представляю, как это обезвредить`)
  }

  public failedToUntrap(player: Player): void {
    this.addMessage(
      LogLevel.WARNING,
      `У меня не получилось обезвредить ловушку`
    )
  }

  public succeededToUntrap(player: Player): void {
    this.addMessage(LogLevel.INFO, `Успешно обезвредил ловушку`)
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

  public bareWireHit(
    sees: boolean,
    reaction: Reaction,
    creature: Creature
  ): void {
    // TODO: Better messages
    this.info(`${creature.name} наступил на оголенный провод`)
  }

  public bareWirePlayerBootResist(): void {
    this.info('Я наступил на оголенный провод, но все обошлось')
  }

  public debug(message: string): void {
    this.addMessage(LogLevel.DEBUG, message)
  }

  public info(message: string): void {
    this.addMessage(LogLevel.INFO, message)
  }

  public warning(message: string): void {
    this.addMessage(LogLevel.WARNING, message)
  }

  public danger(message: string): void {
    this.addMessage(LogLevel.DANGER, message)
  }

  protected addMessage(level: LogLevel, message: string): void {
    const lastRow: LogMessage | undefined = last(this.messages)

    if (lastRow && lastRow.message === message) {
      lastRow.counter += 1
    } else {
      this.messages.push({ level, message, counter: 1 })
    }
  }
}
