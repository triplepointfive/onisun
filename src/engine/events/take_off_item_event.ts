import { InventorySlot, CreatureEvent, Game, Item, Armor } from '../../engine'
import { Reaction, Creature } from '../models/creature'
import { Player } from '../models/player'
import { findIndex } from 'lodash'
import { Protection, Weapon } from '../models/items'
import { Damage } from '../lib/damage'

export class TakeOffItemEvent extends CreatureEvent {
  constructor(private slot: InventorySlot, private game: Game) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    return Reaction.NOTHING
  }

  public affectPlayer(player: Player): Reaction {
    const equipment = this.slot.equipment

    if (equipment === undefined) {
      throw `Can not take off item from ${this.slot.name} - nothing equipped`
    }

    this.slot.takeOff()
    this.onTakeOff(player, equipment.item)
    player.inventory.putToBag(equipment.item, equipment.count)
    this.game.logger.takeOff(equipment.item)

    return Reaction.NOTHING
  }

  private onTakeOff(player: Player, item: Item): void {
    // player.characteristics.removeModifier(item.modifier)

    if (item instanceof Armor) {
      item.protections.forEach((itemProtection: Protection) => {
        player.itemsProtections.splice(
          findIndex(
            player.itemsProtections,
            protection => protection === itemProtection
          ),
          1
        )
      })
    }

    if (item instanceof Weapon) {
      item.damages.forEach((itemDamage: Damage) => {
        player.itemsDamages.splice(
          findIndex(player.itemsDamages, damage => damage === itemDamage),
          1
        )
      })
    }
  }
}
