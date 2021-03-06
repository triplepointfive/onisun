import {
  generateGame,
  generateLevelMap,
  generateProfession,
  generatePlayer,
  generateTalent,
} from '../helpers'
import {
  Game,
  Player,
  TalentsPickingPresenter,
  Talent,
  PresenterType,
} from '../../../src/engine'

describe('TalentsTreePresenter', () => {
  let map = generateLevelMap(),
    profession,
    game: Game,
    player: Player,
    presenter: TalentsPickingPresenter,
    talent: Talent

  beforeEach(() => {
    talent = generateTalent()
    talent.onObtain = jest.fn()

    profession = generateProfession()
    profession.talents.push(talent)

    player = generatePlayer()
    game = generateGame({ player: player, professionPicker: undefined })
    player.professions.push(profession)

    presenter = new TalentsPickingPresenter(3, map, game)
    presenter.endTurn = jest.fn()
  })

  it('type', () => {
    expect(presenter.type).toEqual(PresenterType.TalentsPicking)
  })

  it('picking a talent with max rank', () => {
    talent.rank = talent.maxRank
    expect(() => presenter.pickTalent(profession, talent)).toThrow()
  })

  describe('with correct talent', () => {
    beforeEach(() => {
      presenter.pickTalent(profession, talent)
    })

    it('updating its level', () => {
      expect(player.professions[0].talents[0].rank).toEqual(1)
    })

    it('calls talents onObtain', () => {
      expect(talent.onObtain.mock.calls.length).toEqual(1)
    })

    it('ends turn', () => {
      expect(presenter.endTurn.mock.calls.length).toEqual(1)
    })
  })
})
