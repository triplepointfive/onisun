import { PresenterType, Presenter } from './internal'
import { Profession } from '../models/profession'
import { TalentsTreePresenter } from './talents_tree_presenter'
import { Game, LevelMap } from '../../engine'

export class ProfessionPickingPresenter extends Presenter {
  constructor(public readonly level: number, levelMap: LevelMap, game: Game) {
    super(levelMap, game)
  }

  get type(): PresenterType {
    return PresenterType.ProfessionPicking
  }

  get title(): string {
    return `Gained ${this.level} level`
  }

  get options(): Profession[] {
    return this.game.professionPicker.available(this.player)
  }

  public pickProfession(pickedProfession: Profession) {
    let playerProfession = this.player.professions.find(
      profession => profession.id === pickedProfession.id
    )

    if (playerProfession) {
      playerProfession.level += 1
    } else {
      this.player.professions.push(pickedProfession)
    }

    this.redirect(
      new TalentsTreePresenter(this.level, this.levelMap, this.game)
    )
  }
}
