import { CreatureEvent } from './internal'
import { Creature, Reaction, Player } from '../models/creature'
import { Corpse } from '../models/items'
import { LevelMap } from '../models/level_map'

export class DieEvent extends CreatureEvent {
  constructor(private levelMap: LevelMap) {
    super()
  }

  public affectCreature(creature: Creature): Reaction {
    let tile = this.levelMap.creatureTile(creature)

    this.levelMap.removeCreature(creature)
    creature.dead = true

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
