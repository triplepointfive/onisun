import { Screen, ScreenType } from './internal'
import { Game, ProfessionPickingScreen } from '../../engine'

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

    this.player.levelUps -= 1
    this.player.characteristics.levelUp(this.player.specie)

    if (this.player.levelUps > 0) {
      this.game.screen = (this.player.level.current - this.player.levelUps + 1) % 3 === 0 ? new ProfessionPickingScreen(this.game) : new TalentsTreeScreen(this.game)
    } else {
      this.game.screen = undefined
    }
  }
}
