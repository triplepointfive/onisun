import { Player } from '../models/player'
import { PlayerEvent, Reaction } from './internal'

export class LevelUpEvent extends PlayerEvent {
  public affectPlayer(player: Player): Reaction {
    this.updateHealth(player)

    return Reaction.Nothing
  }

  protected updateHealth(player: Player): void {
    player.health.constantIncrease(player.constitution.levelUpHPBonus)

    if (player.health.maximum < 1) {
      player.health.constantIncrease(1 - player.health.maximum)
    }

    // TODO: Add per race / class hp increase
  }
}
