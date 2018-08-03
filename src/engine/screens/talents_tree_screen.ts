import { Screen, ScreenType } from './internal'
import { Game } from '../../engine'

export class TalentsTreeScreen extends Screen {
  constructor(game: Game) {
    super(ScreenType.AbilitiesPicking, game)
  }

  public onInput(professionId: number, talentId: number) {
    const profession = this.player.professions.find(
      profession => profession.id === professionId
    )
    profession.talents.find(talent => talent.id === talentId).rank += 1
    profession.points += 1
    this.game.screen = undefined
  }
}
