import { Presenter, PresenterType } from './internal'
import { Game, LevelMap, Talent, TalentStatus } from '../../engine'
import { Profession } from '../models/profession'
import { LevelUpEvent } from '../events/level_up_event'

interface TalentsTreePresenterProfession {
  profession: Profession
  talents: Talent[]
}

export class TalentsTreePresenter extends Presenter {
  public readonly options: TalentsTreePresenterProfession[] = []

  constructor(public readonly level: number, levelMap: LevelMap, game: Game) {
    super(levelMap, game)

    this.options = this.player.professions.map(profession => {
      return {
        profession,
        talents: profession.talents,
      }
    })
  }

  get type(): PresenterType {
    return PresenterType.AbilitiesPicking
  }

  public pickTalent(professionId: number, talentName: string): void {
    const profession: Profession | undefined = this.player.professions.find(
      profession => profession.id === professionId
    )

    if (profession === undefined) {
      throw `Profession with id ${professionId} is not found`
    }

    let talent: Talent | undefined = profession.talents.find(
      talent => talent.name === talentName
    )

    if (talent === undefined) {
      throw `Talent ${talentName} for profession ${
        profession.name
      } is not found`
    }

    if (talent.status(profession) !== TalentStatus.Available) {
      throw `Talent ${talentName} for profession ${
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
}
