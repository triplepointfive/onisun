import { generateLevelMap, generateGame, generatePlayer } from '../helpers'
import { PowersInfoPresenter, CharacterInfoPage } from '../../../src/engine'

describe('PowersInfoPresenter', () => {
  const levelMap = generateLevelMap(),
    game = generateGame({ player: generatePlayer() }),
    view = new PowersInfoPresenter(levelMap, game)

  it('page', () => {
    expect(view.page).toEqual(CharacterInfoPage.Powers)
  })

  it('powers', () => {
    expect(view.powers).toEqual([])
  })
})
