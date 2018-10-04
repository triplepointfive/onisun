import { PickUpItemsEvent, LevelMap } from '../../engine'
import { Ability, Creature, AICreature } from '../models/creature'
import { Game } from '../models/game'
import { GoToTileAI } from './internal'
import { AIItemPickedEvent } from './meta_ai'
import { CreatureEvent } from '../events/internal'
import { MemoryTile } from '../models/memory'

export class Picker extends GoToTileAI {
  constructor() {
    super((tile: MemoryTile) => !!tile.items)
  }

  public act(
    actor: Creature,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    if (actor.hasAbility(Ability.Inventory)) {
      return super.act(actor, levelMap, game)
    }
  }

  protected onReach(
    actor: AICreature,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    const tile = levelMap.creatureTile(actor)

    if (!tile.items) {
      throw 'Picker.act : nothing to pick up'
    }

    actor.ai.pushEvent(new AIItemPickedEvent(tile.items, game))

    return new PickUpItemsEvent(tile, tile.items.bunch, game)
  }
}
