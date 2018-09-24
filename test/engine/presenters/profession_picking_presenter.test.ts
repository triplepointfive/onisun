import {
  generateGame,
  generateLevelMap,
  generateProfession,
  generatePlayer,
} from '../helpers'
import {
  ProfessionPickingPresenter,
  ProfessionPicker,
  Game,
  Player,
  TalentsPickingPresenter,
} from '../../../src/engine'

import { sortBy } from 'lodash'

describe('ProfessionPickingPresenter', () => {
  let map = generateLevelMap(),
    profession1,
    profession2,
    professionPicker,
    game: Game,
    player: Player,
    presenter: ProfessionPickingPresenter

  beforeEach(() => {
    profession1 = generateProfession()
    profession2 = generateProfession()
    professionPicker = new ProfessionPicker([profession1, profession2], 3, 3)

    player = generatePlayer()
    game = generateGame({ player: player, professionPicker: professionPicker })
    presenter = new ProfessionPickingPresenter(3, map, game)
    presenter.redirect = jest.fn()
  })

  it('builds options', () => {
    const sort = collection => sortBy(collection, profession => profession.id)

    expect(sort(presenter.options.sort())).toEqual(
      sort([profession1, profession2])
    )
  })

  describe('with new profession', () => {
    beforeEach(() => {
      presenter.pickProfession(profession1)
    })

    it('updating its level', () => {
      expect(player.professions.length).toEqual(1)
      expect(player.professions[0].level).toEqual(2)
    })

    it('redirects to talents screen', () => {
      expect(presenter.redirect.mock.calls.length).toEqual(1)
      expect(presenter.redirect.mock.calls[0][0]).toBeInstanceOf(
        TalentsPickingPresenter
      )
    })
  })

  describe('with exist profession', () => {
    beforeEach(() => {
      player.professions.push(profession1)
      presenter.pickProfession(profession1)
    })

    it('updating its level', () => {
      expect(player.professions.length).toEqual(1)
      expect(player.professions[0].level).toEqual(2)
    })

    it('redirects to talents screen', () => {
      expect(presenter.redirect.mock.calls.length).toEqual(1)
      expect(presenter.redirect.mock.calls[0][0]).toBeInstanceOf(
        TalentsPickingPresenter
      )
    })
  })
})
