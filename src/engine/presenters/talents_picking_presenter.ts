import { Presenter, PresenterType } from './internal'
import { Game, LevelMap, Talent } from '../../engine'
import { Profession } from '../models/profession'
import { LevelUpEvent } from '../events/level_up_event'
import { TalentsPresenter } from './talents_presenter'
import { PickTalentEvent } from '../events/pick_talent_event'

export class TalentsPickingPresenter extends Presenter {
  public readonly talentsPage: TalentsPresenter

  constructor(public readonly level: number, levelMap: LevelMap, game: Game) {
    super(levelMap, game)

    this.talentsPage = new TalentsPresenter(levelMap, game)
  }

  get type(): PresenterType {
    return PresenterType.TalentsPicking
  }

  public pickTalent(profession: Profession, talent: Talent): void {
    this.player.on(new PickTalentEvent(profession, talent))
    this.player.on(new LevelUpEvent())

    this.endTurn()
  }
}
