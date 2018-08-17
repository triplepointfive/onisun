import { Player, InventoryPresenter, IdlePresenter } from '../../../src/engine'

import { generateGame, TestGame, generatePlayer } from '../helpers'

describe('puts on and takes off', () => {
  let game: TestGame = generateGame(),
    player: Player,
    screen: InventoryPresenter

  beforeEach(() => {
    game.player = player = generatePlayer()
    screen = new InventoryPresenter(game)
    screen.redirect = jest.fn()
  })

  it('closes inventory', () => {
    screen.close()
    expect(screen.redirect.mock.calls.length).toBe(1)
    expect(screen.redirect.mock.calls[0][0]).toBeInstanceOf(IdlePresenter)
  })
})
