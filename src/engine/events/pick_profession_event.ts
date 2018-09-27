import { PlayerEvent, Reaction } from './internal'
import { Player } from '../../engine'
import { Profession } from '../models/profession'

export class PickProfessionEvent extends PlayerEvent {
  constructor(private profession: Profession) {
    super()
  }

  public affectPlayer(player: Player): Reaction {
    let playerProfession = player.professions.find(
      profession => profession.id === this.profession.id
    )

    if (playerProfession) {
      // TODO: Validate does not exceed max level
      playerProfession.level += 1
    } else {
      this.profession.level += 1
      player.professions.push(this.profession)
    }

    return Reaction.NOTHING
  }
}
