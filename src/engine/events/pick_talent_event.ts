import { PlayerEvent, Reaction } from './internal'
import { Talent, Profession, TalentStatus } from '../models/profession'
import { Player } from '../models/player'

export class PickTalentEvent extends PlayerEvent {
  constructor(private profession: Profession, private talent: Talent) {
    super()
  }

  public affectPlayer(player: Player): Reaction {
    if (this.talent.status(this.profession) !== TalentStatus.Available) {
      throw `Talent ${this.talent.name} for profession ${
        this.profession.name
      } can not be upgraded`
    }

    this.talent.upgrade(player)
    this.profession.points += 1

    return Reaction.NOTHING
  }
}
