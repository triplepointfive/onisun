import { Creature, Reaction } from './creature'
import { Item, Potion, CorrosionLevel } from './item'

import { last } from 'lodash'
import { Player } from './player'
import { BodyPart } from './inventory_slot'

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

  public lightTrapActivated(
    player: Player,
    sees: boolean,
    isPlayer: boolean,
    actor: Creature
  ): void {
    if (isPlayer) {
      this.addMessage(LogLevel.INFO, `Яркая вспышка света ослепила меня`)
    } else {
      this.addMessage(
        LogLevel.INFO,
        `${actor.name} озарился яркой вспышкой света`
      )
    }
  }

  public lightTrapDodge(
    player: Player,
    sees: boolean,
    isPlayer: boolean,
    actor: Creature
  ): void {
    if (isPlayer) {
      this.addMessage(LogLevel.INFO, `Вспышка света чуть не ослепила меня`)
    } else {
      this.addMessage(
        LogLevel.INFO,
        `${actor.name} озарился яркой вспышкой света`
      )
    }
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

  public bareWireUntrapDoNotWant() {
    this.info('Трогать оголенный провод руками так себе затея')
  }

  public bareWirePlayerBootResist(): void {
    this.info('Я наступил на оголенный провод, но все обошлось')
  }

  public fallingTrapRests(player: Player): void {
    // TODO: Different messages when head is firm or item if firm
    return this.info('Камень упал мне на голову, но каска защитила меня')
  }

  public fallingTrapRanOut(): void {
    return this.debug('Громкий щелчок, но ничего не произошло')
  }

  public fallingTrapDodge(
    player: Player,
    sees: boolean,
    isPlayer: boolean,
    actor: Creature
  ): void {
    this.info(`${actor.name} увернулся от ловушки`)
  }

  public fallingTrapActivate(
    player: Player,
    sees: boolean,
    isPlayer: boolean,
    reaction: Reaction,
    actor: Creature
  ): void {
    this.info(`${actor.name} попал в ловушку`)
  }

  public waterTrapActivated(): void {
    this.info(`Я попал в ловушку с водой`)
  }

  public waterBodyPartEquipmentResist(bodyPart: BodyPart, item: Item): void {
    this.debug(`${item.name} защитил ${bodyPart.name} от воды`)
  }

  public waterBodyPartDamage(bodyPart: BodyPart, reaction: Reaction): void {
    switch (reaction) {
      case Reaction.DIE:
        this.danger(
          `Вода попала мне на ${bodyPart.name}, рана не совместима с жизнью`
        )
        break
      case Reaction.HURT:
        this.danger(`Вода обожгла мне ${bodyPart.name}`)
        break
      case Reaction.NOTHING:
      case Reaction.RESIST:
        this.danger(`Вода попала мне на ${bodyPart.name}, но все обошлось`)
        break
    }
  }

  public waterTrapDamage(
    player: Player,
    sees: boolean,
    isPlayer: boolean,
    reaction: Reaction,
    creature: Creature
  ): void {
    if (!sees) {
      return
    }

    switch (reaction) {
      case Reaction.DIE:
        this.danger(`${creature.name} растворился в потоках воды`)
        break
      case Reaction.DODGE:
        this.info(`${creature.name} уклонился от потока воды`)
        break
      case Reaction.HURT:
        this.warning(`${creature.name} пострадал от воды`)
        break
      case Reaction.NOTHING:
      case Reaction.RESIST:
        if (!isPlayer) {
          this.debug(`${creature.name} был облит водой`)
        }
        break
    }
  }

  public itemCorrode(item: Item): void {
    switch (item.corrosionLevel) {
      case CorrosionLevel.Slightly:
        return this.info(`${item.name} немного заржавел`)
      case CorrosionLevel.Mostly:
        return this.info(`${item.name} значительно проржавел`)
      case CorrosionLevel.Fully:
        return this.warning(`${item.name} полностью проржавел`)
    }
  }

  public itemDestroyByWater(item: Item, count: number): void {
    this.warning(`${count} ${item.name} были уничтожены водой`)
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
