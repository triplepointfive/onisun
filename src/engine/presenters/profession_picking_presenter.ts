import { Game } from '../game'
import { PresenterType, Presenter } from './internal'
import { Profession } from '../profession'
import { TalentsTreePresenter } from './talents_tree_presenter'

export class ProfessionPickingPresenter extends Presenter {
  public options: Profession[]
  public title: string

  constructor(game: Game) {
    super(PresenterType.ProfessionPicking, game)
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

    this.redirect(new TalentsTreePresenter(this.game))
  }
}
