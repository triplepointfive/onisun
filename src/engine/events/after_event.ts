import { DieEvent, DieReason, Game, ImpactType, LevelMap } from '../../engine'
import { Reaction } from '../models/creature'
import { Player } from '../models/player'
import { PlayerEvent } from './player_event'

export class AfterEvent extends PlayerEvent {
  constructor(private levelMap: LevelMap, private game: Game) {
    super()
  }

  public affectPlayer(player: Player): Reaction {
    player.removeImpact(ImpactType.Overloaded, 'bag')
    player.removeImpact(ImpactType.Stressed, 'bag')
    player.removeImpact(ImpactType.Loaded, 'bag')

    if (player.stuffWeight.current > player.carryingCapacity.flattenedStart) {
      return player.on(
        new DieEvent(this.game, this.levelMap, DieReason.Overloaded)
      )
    }

    if (player.stuffWeight.current > player.carryingCapacity.overloadedStart) {
      player.addImpact(ImpactType.Overloaded, 'bag')
    } else if (
      player.stuffWeight.current > player.carryingCapacity.loadedStart
    ) {
      player.addImpact(ImpactType.Loaded, 'bag')
    } else if (player.stuffWeight.current > player.carryingCapacity.stressed) {
      player.addImpact(ImpactType.Stressed, 'bag')
    }

    return Reaction.NOTHING
  }
}
