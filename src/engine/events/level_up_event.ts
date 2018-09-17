import { PlayerEvent } from './player_event'
import { Reaction } from '../models/creature'
import { Player } from '../models/player'

export class LevelUpEvent extends PlayerEvent {
  public affectPlayer(player: Player): Reaction {
    this.updateHealth(player)

    return Reaction.NOTHING
  }

  protected updateHealth(player: Player): void {
    player.health.constantIncrease(player.constitution.levelUpHPBonus)

    if (player.health.maximum < 1) {
      player.health.constantIncrease(1 - player.health.maximum)
    }

    // TODO: Add per race / class hp increase
  }
}
