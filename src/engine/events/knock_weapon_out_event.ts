import { random } from 'lodash'
import {
  Creature,
  Game,
  ImpactType,
  LevelMap,
  Player,
  RemoveItemEvent,
  Calculator,
} from '../../engine'
import { Power } from '../models/creature'
import { CreatureEvent, Reaction } from './internal'

class DisarmEvent extends CreatureEvent {
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
      return Reaction.Nothing
    } else if (
      Calculator.misses(this.actor.bodyControl, creature.bodyControl)
    ) {
      // TODO: Log
      return Reaction.Dodge
    } else if (this.succeeded()) {
      creature.addImpact(ImpactType.Disarmed, this.turns())
      this.game.logger.disarmLogger.successOnCreature(creature)

      return Reaction.Success
    }

    this.game.logger.disarmLogger.fail(creature, false)
    return Reaction.Resist
  }

  public affectPlayer(player: Player): Reaction {
    if (!player.canBeDisarmed()) {
      this.game.logger.disarmLogger.nothingToDisarm(player)
      return Reaction.Nothing
    } else if (Calculator.misses(this.actor.bodyControl, player.bodyControl)) {
      // TODO: Log
      return Reaction.Dodge
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
    return Reaction.Resist
  }

  private succeeded(): boolean {
    return Calculator.chance(1, this.chance)
  }

  private rightHand(): boolean {
    return Calculator.chance(1, 2)
  }

  private bothHands(): boolean {
    return Calculator.chance(1, 10)
  }

  private turns(): number {
    return random(3, 5)
  }
}

export class KnockWeaponOutEvent extends CreatureEvent {
  constructor(
    private victim: Creature,
    private levelMap: LevelMap,
    private game: Game
  ) {
    super()
  }

  public affectCreature(creature: Creature): Reaction {
    creature.coolDown.add(Power.KnockWeaponOut, this.coolDownTurns())

    return this.victim.on(
      new DisarmEvent(creature, 1, this.levelMap, this.game)
    )
  }

  private coolDownTurns(): number {
    return 10 // TODO:
  }
}
