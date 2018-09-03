import { CreatureEvent } from './internal'
import { InventorySlot, Item, Game } from '../../engine'
import { Creature, Reaction, Player } from '../models/creature'
import { TakeOffItemEvent } from './take_off_item_event'
import { Armor, Weapon } from '../models/items'

export class PutOnItemEvent extends CreatureEvent {
  constructor(
    private slot: InventorySlot,
    private item: Item,
    private game: Game
  ) {
    super()
  }

  public affectCreature(creature: Creature): Reaction {
    return Reaction.NOTHING
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
      if (reaction !== Reaction.NOTHING) {
        return reaction
      }
    }

    const count = this.slot.useSingleItem ? 1 : groupItem.count

    player.removeItem(this.item, count)
    this.slot.equip(this.item, count)
    this.onPutOn(player, this.item)

    this.game.logger.putOn(this.item)

    return Reaction.NOTHING
  }

  private onPutOn(player: Player, item: Item): void {
    player.characteristics.addModifier(item.modifier)

    if (item instanceof Armor) {
      player.itemsProtections = player.itemsProtections.concat(item.protections)
    }

    if (item instanceof Weapon) {
      player.itemsDamages = player.itemsDamages.concat(item.damages)
    }
  }
}
