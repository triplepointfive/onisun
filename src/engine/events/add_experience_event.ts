import { PlayerEvent, Reaction } from './internal'
import { Creature } from '../models/creature'
import { Player } from '../models/player'
import { Game, AINewLevelEvent, LevelMap } from '../../engine'

export class AddExperienceEvent extends PlayerEvent {
  constructor(
    public actor: Creature,
    private levelMap: LevelMap,
    private game: Game
  ) {
    super()
  }

  public affectPlayer(subject: Player): Reaction {
    subject.level.add(1).forEach(level => {
      subject.ai.pushEvent(new AINewLevelEvent(level, this.levelMap, this.game))
    })

    return Reaction.Nothing
  }
}
