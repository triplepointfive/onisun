import { generateGame, generatePlayer, generateLevelMap } from '../helpers'
import { Game, DieReason, DeathPresenter } from '../../../src/engine'

describe('DeathPresenter', () => {
  const game: Game = generateGame(),
    player = generatePlayer(),
    presenter = new DeathPresenter(DieReason.Attack, generateLevelMap(), game)

  beforeAll(() => {
    game.player = player
  })

  it('returns player name', () => {
    expect(presenter.playerName).toEqual(player.name)
  })
})
