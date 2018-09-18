import { Presenter, PresenterType } from './internal'
import { Game, LevelMap, Talent, TalentStatus } from '../../engine'
import { Profession } from '../models/profession'
import { LevelUpEvent } from '../events/level_up_event'

interface TalentWithStatus extends Talent {
  status: TalentStatus
}

interface TalentsTreePresenterProfession {
  profession: Profession
  talents: TalentWithStatus[]
}

export class TalentsTreePresenter extends Presenter {
  public readonly options: TalentsTreePresenterProfession[] = []

  constructor(public readonly level: number, levelMap: LevelMap, game: Game) {
    super(levelMap, game)

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

  get type(): PresenterType {
    return PresenterType.AbilitiesPicking
  }

  get title(): string {
    return 'Pick new talent'
  }

  public pickTalent(professionId: number, talentId: number): void {
    const profession: Profession | undefined = this.player.professions.find(
      profession => profession.id === professionId
    )

    if (profession === undefined) {
      throw `Profession with id ${professionId} is not found`
    }

    let talent: Talent | undefined = profession.talents.find(
      talent => talent.id === talentId
    )

    if (talent === undefined) {
      throw `Talent with id ${talentId} for profession ${
        profession.name
      } is not found`
    }

    if (this.status(talent, profession) !== TalentStatus.Available) {
      throw `Talent with id ${talentId} for profession ${
        profession.name
      } can not be upgraded`
    }

    talent.rank += 1
    if (talent.rank === 1) {
      talent.onObtain(this.game)
    }

    profession.points += 1

    this.player.on(new LevelUpEvent())

    this.endTurn()
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
