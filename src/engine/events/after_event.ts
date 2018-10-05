import { DieEvent, DieReason, Game, ImpactType, LevelMap } from '../../engine'
import { Creature } from '../models/creature'
import { Player } from '../models/player'
import { CreatureEvent, Reaction } from './internal'

export class AfterEvent extends CreatureEvent {
  constructor(private levelMap: LevelMap, private game: Game) {
    super()
  }

  public affectCreature(creature: Creature): Reaction {
    return Reaction.Nothing
  }

  public affectPlayer(player: Player): Reaction {
    player.removeConstImpact(ImpactType.Overloaded, 'bag')
    player.removeConstImpact(ImpactType.Stressed, 'bag')
    player.removeConstImpact(ImpactType.Loaded, 'bag')

    if (player.stuffWeight.current > player.carryingCapacity.flattenedStart) {
      return player.on(
        new DieEvent(this.game, this.levelMap, DieReason.Overloaded)
      )
    }

    if (player.stuffWeight.current > player.carryingCapacity.overloadedStart) {
      player.addConstImpact(ImpactType.Overloaded, 'bag')
    } else if (
      player.stuffWeight.current > player.carryingCapacity.loadedStart
    ) {
      player.addConstImpact(ImpactType.Loaded, 'bag')
    } else if (player.stuffWeight.current > player.carryingCapacity.stressed) {
      player.addConstImpact(ImpactType.Stressed, 'bag')
    }

    return Reaction.Nothing
  }
}
