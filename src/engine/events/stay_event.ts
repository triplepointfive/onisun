import { CreatureEvent, Reaction } from './internal'
import { Creature } from '../models/creature'
import { LevelMap } from '../models/level_map'

export class StayEvent extends CreatureEvent {
  constructor(private levelMap: LevelMap) {
    super()
  }

  public affectCreature(creature: Creature): Reaction {
    let memory = creature.stageMemory(this.levelMap)

    this.levelMap
      .creaturePos(creature)
      .wrappers()
      .forEach(({ x, y }) => {
        memory.at(x, y).see(this.levelMap.at(x, y), 0)
      })

    return Reaction.NOTHING
  }
}
