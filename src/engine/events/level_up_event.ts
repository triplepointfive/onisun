import { PlayerEvent } from './player_event'
import { Reaction } from '../models/creature'
import { Player } from '../models/player'

export class LevelUpEvent extends PlayerEvent {
  public affectPlayer(player: Player): Reaction {
    this.updateHealth(player)

    return Reaction.NOTHING
  }

  protected updateHealth(player: Player): void {
    const constitution = player.constitution.current

    if (constitution < 3) {
      player.health.constantDecrease(2)
    } else if (constitution < 6) {
      player.health.constantDecrease(1)
    } else if (constitution < 12) {
      // No change
    } else if (constitution < 15) {
      player.health.constantIncrease(1)
    } else if (constitution < 18) {
      player.health.constantIncrease(2)
    } else if (constitution < 20) {
      player.health.constantIncrease(3)
    } else {
      player.health.constantIncrease(4)
    }

    if (player.health.maximum < 1) {
      player.health.constantIncrease(1 - player.health.maximum)
    }

    // TODO: Add per race / class hp increase
  }
}
