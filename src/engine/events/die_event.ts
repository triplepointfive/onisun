import { CreatureEvent } from './internal'
import { Creature, Reaction, Player } from '../models/creature'
import { Corpse } from '../models/items'
import { LevelMap } from '../models/level_map'
import { Game } from '../models/game'
import { AIDieEvent } from '../ai/player_ai'
import { DeathPresenter } from '../presenters/death_presenter'

export enum DieReason {
  Attack,
  Missile,
  Trap,
  Overloaded,
}

export class DieEvent extends CreatureEvent {
  constructor(
    private game: Game,
    private levelMap: LevelMap,
    private reason: DieReason
  ) {
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
    // TODO: On dying update vision
    player.ai.presenter = new DeathPresenter(
      this.reason,
      this.levelMap,
      this.game
    )
    player.dead = true
    this.game.ai = player.ai

    return Reaction.DIE
  }
}
