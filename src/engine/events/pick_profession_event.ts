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

    if (!playerProfession) {
      player.professions.push(this.profession)
    }

    // TODO: Validate does not exceed max level
    this.profession.level += 1

    return Reaction.NOTHING
  }
}
