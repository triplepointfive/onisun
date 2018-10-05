import { PlayerEvent, Reaction } from './internal'
import { InventorySlot, Item, Game } from '../../engine'
import { Player } from '../models/player'
import { TakeOffItemEvent } from './take_off_item_event'
import { Armor } from '../models/item'
import { AddImpactEvent } from './add_impact_event'

export class PutOnItemEvent extends PlayerEvent {
  constructor(
    private slot: InventorySlot,
    private item: Item,
    private game: Game
  ) {
    super()
  }

  public affectPlayer(player: Player): Reaction {
    let inventory = player.inventory,
      groupItem = inventory.findInBag(this.item)

    if (groupItem === undefined) {
      throw `Item ${
        this.item.name
      } can not be equipped - not found in inventory`
    }

    // TODO: assert that can't equip more than have in inventory
    // TODO: assert can equip
    if (this.slot.equipment) {
      const reaction = player.on(new TakeOffItemEvent(this.slot, this.game))
      if (reaction !== Reaction.Nothing) {
        return reaction
      }
    }

    const count = this.slot.useSingleItem ? 1 : groupItem.count

    player.removeItem(this.item, count)
    this.slot.equip(this.item, count)
    this.onPutOn(player, this.item)

    this.game.logger.putOn(this.item)

    return Reaction.Nothing
  }

  private onPutOn(player: Player, item: Item): void {
    if (item instanceof Armor) {
      player.itemsProtections = player.itemsProtections.concat(item.protections)
    }

    item.impacts.forEach(impact => {
      player.on(new AddImpactEvent(impact, item.name, this.game))
    })
  }
}
