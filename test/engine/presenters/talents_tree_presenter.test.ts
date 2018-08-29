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
  TalentsTreePresenter,
  Talent,
  TalentStatus,
} from '../../../src/engine'

describe('TalentsTreePresenter', () => {
  let map = generateLevelMap(),
    profession,
    game: Game,
    player: Player,
    presenter: TalentsTreePresenter,
    talent: Talent

  beforeEach(() => {
    talent = generateTalent()
    talent.onObtain = jest.fn()

    profession = generateProfession()
    profession.talents.push(talent)

    player = generatePlayer()
    game = generateGame({ player: player, professionPicker: undefined })
    player.professions.push(profession)

    presenter = new TalentsTreePresenter(3, map, game)
    presenter.endTurn = jest.fn()
  })

  it('builds title', () => {
    expect(presenter.title).toEqual('Pick new talent')
  })

  describe('talent status', () => {
    it('available', () => {
      presenter = new TalentsTreePresenter(3, map, game)

      expect(presenter.options.length).toEqual(1)
      expect(presenter.options[0].profession).toEqual(profession)
      expect(presenter.options[0].talents[0].status).toEqual(
        TalentStatus.Available
      )
    })

    it('completed', () => {
      talent.rank = talent.maxRank
      presenter = new TalentsTreePresenter(3, map, game)

      expect(presenter.options.length).toEqual(1)
      expect(presenter.options[0].profession).toEqual(profession)
      expect(presenter.options[0].talents[0].status).toEqual(
        TalentStatus.Completed
      )
    })

    it('unavailable', () => {
      talent = generateTalent({ depth: 3 })
      profession.talents = [talent]

      presenter = new TalentsTreePresenter(3, map, game)

      expect(presenter.options.length).toEqual(1)
      expect(presenter.options[0].profession).toEqual(profession)
      expect(presenter.options[0].talents[0].status).toEqual(
        TalentStatus.Unavailable
      )
    })
  })

  it('picking a talent for not picked profession', () => {
    player.professions = []
    expect(() => presenter.pickTalent(profession.id, talent.id)).toThrow()
  })

  it('picking a talent for not related profession', () => {
    expect(() =>
      presenter.pickTalent(profession.id, generateTalent().id)
    ).toThrow()
  })

  it('picking a talent with max rank', () => {
    talent.rank = talent.maxRank
    expect(() => presenter.pickTalent(profession.id, talent.id)).toThrow()
  })

  describe('with correct talent', () => {
    beforeEach(() => {
      presenter.pickTalent(profession.id, talent.id)
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
