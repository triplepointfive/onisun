import { Presenter, PresenterType } from './internal'
import { Game, LevelMap, Talent, TalentStatus } from '../../engine'
import { Profession } from '../models/profession'
import { LevelUpEvent } from '../events/level_up_event'
import { TalentsPresenter } from './talents_presenter'

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
    if (talent.status(profession) !== TalentStatus.Available) {
      throw `Talent ${talent.name} for profession ${
        profession.name
      } can not be upgraded`
    }

    talent.upgrade(this.player)
    profession.points += 1

    this.player.on(new LevelUpEvent())

    this.endTurn()
  }
}
