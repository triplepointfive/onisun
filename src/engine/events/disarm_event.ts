import { CreatureEvent, Reaction } from './internal'
import {
  Creature,
  LevelMap,
  Game,
  ImpactType,
  Player,
  RemoveItemEvent,
} from '../../engine'

import { random } from 'lodash'

export class KnockWeaponOutEvent extends CreatureEvent {
  constructor(
    private victim: Creature,
    private levelMap: LevelMap,
    private game: Game
  ) {
    super()
  }

  public affectCreature(creature: Creature): Reaction {
    return this.victim.on(
      new DisarmEvent(creature, 1, this.levelMap, this.game)
    )
  }
}

export class DisarmEvent extends CreatureEvent {
  constructor(
    private actor: Creature,
    private chance: number,
    private levelMap: LevelMap,
    private game: Game
  ) {
    super()
  }

  public affectCreature(creature: Creature): Reaction {
    if (!creature.canBeDisarmed()) {
      this.game.logger.disarmLogger.nothingToDisarm(creature)
      return Reaction.NOTHING
    } else if (this.succeeded()) {
      creature.addImpact(ImpactType.Disarmed, this.turns())
      this.game.logger.disarmLogger.successOnCreature(creature)

      return Reaction.Success
    }

    this.game.logger.disarmLogger.fail(creature, false)
    return Reaction.RESIST
  }

  public affectPlayer(player: Player): Reaction {
    if (!player.canBeDisarmed()) {
      this.game.logger.disarmLogger.nothingToDisarm(player)
      return Reaction.NOTHING
    } else if (this.succeeded()) {
      let slots = []

      if (this.bothHands()) {
        slots.push(player.inventory.rightHandSlot)
        slots.push(player.inventory.leftHandSlot)
      } else if (
        (player.inventory.rightHandSlot.equipment && this.rightHand()) ||
        player.inventory.leftHandSlot.equipment === undefined
      ) {
        slots.push(player.inventory.rightHandSlot)
      } else {
        slots.push(player.inventory.leftHandSlot)
      }

      const tile = this.levelMap.creatureTile(player)
      slots.forEach(slot => {
        if (slot.equipment) {
          const item = slot.equipment.item
          player.on(new RemoveItemEvent(slot, 1, this.game))
          tile.addItem(item, 1)

          this.game.logger.disarmLogger.successOnPlayer(this.actor, item)
        }
      })

      return Reaction.Success
    }

    this.game.logger.disarmLogger.fail(player, true)
    return Reaction.RESIST
  }

  private succeeded(): boolean {
    return Math.random() < this.chance // EXTRA: Luck based, move to calculator
  }

  private rightHand(): boolean {
    return Math.random() < 0.5
  }

  private bothHands(): boolean {
    return Math.random() < 0.1
  }

  private turns(): number {
    return random(3, 5)
  }
}
