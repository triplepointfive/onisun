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
  TalentStatus,
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

  it('picking a talent for not picked profession', () => {
    player.professions = []
    expect(() => presenter.pickTalent(profession.id, talent.name)).toThrow()
  })

  it('picking a talent for not related profession', () => {
    expect(() =>
      presenter.pickTalent(profession.id, generateTalent().name)
    ).toThrow()
  })

  it('picking a talent with max rank', () => {
    talent.rank = talent.maxRank
    expect(() => presenter.pickTalent(profession.id, talent.name)).toThrow()
  })

  describe('with correct talent', () => {
    beforeEach(() => {
      presenter.pickTalent(profession.id, talent.name)
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
