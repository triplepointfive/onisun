import { CreatureEvent } from './internal'
import { Creature, Reaction, Player } from '../models/creature'
import { Corpse } from '../models/items'

export class DieEvent extends CreatureEvent {
  public affectCreature(creature: Creature): Reaction {
    creature.currentLevel.removeCreature(creature)
    creature.dead = true

    let tile = creature.currentLevel.at(creature.pos.x, creature.pos.y)
    tile.addItem(new Corpse(creature.specie), 1)

    creature.inventory.slots().forEach(({ equipment }) => {
      if (equipment) {
        tile.addItem(equipment.item, equipment.count)
      }
    })

    creature.inventory.cares().forEach(invItem => {
      tile.addItem(invItem.item, invItem.count)
    })

    return Reaction.DIE
  }

  public affectPlayer(player: Player): Reaction {
    return this.affectCreature(player)
  }
}
