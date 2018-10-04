import {
  InventorySlot,
  CreatureEvent,
  Game,
  Item,
  Armor,
  RemoveImpactEvent,
  Reaction,
} from '../../engine'
import { Creature } from '../models/creature'
import { Player } from '../models/player'
import { findIndex } from 'lodash'
import { Protection } from '../models/item'

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

    item.impacts.forEach(impact => {
      player.on(new RemoveImpactEvent(impact, this.game, item.name))
    })
  }
}
