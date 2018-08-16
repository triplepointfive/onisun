import { CreatureEvent } from './internal';
import { GroupedItem } from '../items';
import { Game } from '../game';
import { Tile } from '../../engine';
import { Reaction, Creature } from '../creature';

export class PickUpItemsEvent extends CreatureEvent {
  constructor(private tile: Tile, private items: GroupedItem[], private game: Game) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    // TODO: Ensure never happens
    // if (!this.items.length) {
    //   this.redirect(new IdlePresenter(this.game))
    // }

    let tileItems = this.tile.items

    this.items.forEach(({ item, count }) => {
      actor.inventory.putToBag(item, count)
      this.game.logger.pickedUpItem(item, count)
      tileItems.remove(item, count)
    })

    return Reaction.NOTHING
  }
}
