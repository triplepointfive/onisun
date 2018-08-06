import { Game } from '../game'
import { ScreenType, Screen } from './internal'
import { Profession } from '../profession'
import { TalentsTreeScreen } from './talents_tree_screen'

export class ProfessionPickingScreen extends Screen {
  public options: Profession[]
  public title: string

  constructor(game: Game) {
    super(ScreenType.ProfessionPicking, game)
    this.options = this.game.professionPicker.available(this.player)

    this.title = `Gained ${this.player.level.current -
      this.player.levelUps +
      1} level`
  }

  public onInput(pickedProfession: Profession) {
    let playerProfession = this.player.professions.find(
      profession => profession.id === pickedProfession.id
    )
    if (playerProfession) {
      playerProfession.level += 1
    } else {
      this.player.professions.push(pickedProfession)
    }

    this.game.screen = new TalentsTreeScreen(this.game)
  }
}
