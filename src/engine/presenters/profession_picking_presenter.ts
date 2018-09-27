import { PresenterType, Presenter } from './internal'
import { Profession } from '../models/profession'
import { TalentsPickingPresenter } from './talents_picking_presenter'
import { Game, LevelMap, PickProfessionEvent } from '../../engine'

export class ProfessionPickingPresenter extends Presenter {
  public readonly options: Profession[]

  constructor(public readonly level: number, levelMap: LevelMap, game: Game) {
    super(levelMap, game)
    this.options = this.game.professionPicker.available(this.player)
  }

  get type(): PresenterType {
    return PresenterType.ProfessionPicking
  }

  public pickProfession(pickedProfession: Profession) {
    this.player.on(new PickProfessionEvent(pickedProfession))

    this.redirect(
      new TalentsPickingPresenter(this.level, this.levelMap, this.game)
    )
  }
}
