import { GroupedItem } from '../lib/bunch'
import { Calculator } from '../lib/calculator'
import { Damage } from '../lib/damage'
import { WaterAffect } from '../lib/material'
import { Creature } from '../models/creature'
import { Game } from '../models/game'
import { BodyPart, InventorySlot } from '../models/inventory_slot'
import { Item } from '../models/item'
import { LevelMap } from '../models/level_map'
import { Player } from '../models/player'
import { DieReason } from './die_event'
import { HurtEvent } from './hurt_event'
import { CreatureEvent, Reaction } from './internal'
import { RemoveItemEvent } from './remove_item_event'

export class WaterDamageEvent extends CreatureEvent {
  private playerReaction: Reaction = Reaction.Nothing

  constructor(
    private damages: Damage[],
    private levelMap: LevelMap,
    private game: Game
  ) {
    super()
  }

  public affectCreature(creature: Creature): Reaction {
    if (creature.specie.material.affectedWithWater) {
      return creature.on(
        new HurtEvent(this.damages, DieReason.Trap, this.levelMap, this.game)
      )
    } else {
      return Reaction.Resist
    }
  }

  public affectPlayer(player: Player): Reaction {
    this.affectBodyParts(player)
    this.affectInventory(player)
    this.affectEquipment(player)
    return this.playerReaction
  }

  protected affectEquipment(player: Player): void {
    if (player.dead) {
      return
    }

    player.inventory.slots().forEach((inventorySlot: InventorySlot) => {
      if (
        inventorySlot.equipment &&
        inventorySlot.equipment.item.affectedWithWater
      ) {
        const { item, count } = inventorySlot.equipment

        switch (item.material.affectedWithWater) {
          case WaterAffect.Corrosion:
            // TODO: Should corrode all items?
            if (Calculator.chance(1, 3) && item.corrode()) {
              this.game.logger.itemCorrode(item)
            }
            break
          case WaterAffect.Destroy:
            if (Calculator.chance(1, 4)) {
              const destroyedCount = Calculator.lowerWeight(count)
              this.game.logger.itemDestroyByWater(item, destroyedCount)
              // TODO: Do not log  taking off item?
              player.on(
                new RemoveItemEvent(inventorySlot, destroyedCount, this.game)
              )
            }
            break
        }
      }
    })
  }

  protected affectInventory(player: Player): void {
    if (player.dead) {
      return
    }

    player.inventory.cares().forEach(({ count, item }: GroupedItem<Item>) => {
      switch (item.material.affectedWithWater) {
        case WaterAffect.Corrosion:
          if (Calculator.chance(1, 4) && item.corrode()) {
            this.game.logger.itemCorrode(item)
          }
          break
        case WaterAffect.Destroy:
          if (Calculator.chance(1, 6)) {
            const destroyedCount = Calculator.lowerWeight(count)
            this.game.logger.itemDestroyByWater(item, destroyedCount)
            player.inventory.removeFromBag(item, destroyedCount)
          }
          break
      }
    })
  }

  protected affectBodyParts(player: Player): void {
    player.inventory.bodyParts.forEach((bodyPart: BodyPart) => {
      if (player.dead) {
        return
      }

      if (bodyPart.affectedWithWater) {
        if (bodyPart.equipment) {
          this.game.logger.waterBodyPartEquipmentResist(
            bodyPart,
            bodyPart.equipment.item
          )
          this.trackReaction(Reaction.Resist)
        } else {
          let reaction = player.on(
            new HurtEvent(
              this.damages,
              DieReason.Trap,
              this.levelMap,
              this.game
            )
          )
          this.game.logger.waterBodyPartDamage(bodyPart, reaction)
          this.trackReaction(reaction)
        }
      }
    })
  }

  protected trackReaction(reaction: Reaction): void {
    if (this.playerReaction === Reaction.Hurt && reaction === Reaction.Die) {
      this.playerReaction = Reaction.Die
    } else if (this.playerReaction === Reaction.Hurt) {
      this.playerReaction = Reaction.Hurt
    } else {
      this.playerReaction = reaction
    }
  }
}
