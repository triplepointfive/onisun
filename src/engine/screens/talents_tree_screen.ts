import { Presenter, PresenterType } from './internal'
import { Game, ProfessionPickingPresenter } from '../../engine'
import { Profession, Talent, TalentStatus } from '../profession'

interface TalentWithStatus extends Talent {
  status: TalentStatus
}

interface TalentsTreePresenterProfession {
  profession: Profession
  talents: TalentWithStatus[]
}

export class TalentsTreePresenter extends Presenter {
  public options: TalentsTreePresenterProfession[] = []

  constructor(game: Game) {
    super(PresenterType.AbilitiesPicking, game)

    this.options = this.player.professions.map(profession => {
      return {
        profession,
        talents: profession.talents.map(talent => {
          return Object.assign({}, talent, {
            status: this.status(talent, profession),
          })
        }),
      }
    })
  }

  public onInput(professionId: number, talentId: number) {
    const profession = this.player.professions.find(
      profession => profession.id === professionId
    )
    profession.talents.find(talent => talent.id === talentId).rank += 1
    profession.points += 1

    this.player.levelUps -= 1
    this.player.characteristics.levelUp(this.player.specie)

    if (this.player.levelUps > 0) {
      this.game.screen =
        (this.player.level.current - this.player.levelUps + 1) % 3 === 0
          ? new ProfessionPickingPresenter(this.game)
          : new TalentsTreePresenter(this.game)
    } else {
      this.game.screen = undefined
    }
  }

  private status(talent: Talent, profession: Profession): TalentStatus {
    if (talent.rank === talent.maxRank) {
      return TalentStatus.Completed
    } else if (talent.depth * profession.depthCost > profession.points) {
      return TalentStatus.Unavailable
    } else {
      return TalentStatus.Available
    }
  }
}
