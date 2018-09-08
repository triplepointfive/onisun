import { CreatureEvent } from './internal'
import { Creature, Reaction } from '../models/creature'
import { Player } from '../models/player'
import { Corpse } from '../models/items'
import { LevelMap } from '../models/level_map'
import { Game } from '../models/game'
import { DeathPresenter } from '../presenters/death_presenter'
import { AIDieEvent } from '../ai/player_ai'

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

    creature.inventoryItems.forEach(invItem =>
      tile.addItem(invItem.item, invItem.count)
    )

    return Reaction.DIE
  }

  public affectPlayer(player: Player): Reaction {
    player.ai.pushEvent(new AIDieEvent(this.reason, this.levelMap, this.game))
    player.dead = true
    this.game.playerTurn = true

    return Reaction.DIE
  }
}
