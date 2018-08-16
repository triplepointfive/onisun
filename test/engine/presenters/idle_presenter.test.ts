import {
  IdlePresenter,
  IdleInputKey,
  Player,
  InventoryPresenter,
} from '../../../src/engine'

import { generateGame, TestGame, generatePlayer } from '../../helpers'

describe('puts on and takes off', () => {
  let game: TestGame = generateGame(),
    player: Player,
    screen: IdlePresenter

  beforeEach(() => {
    game.player = player = generatePlayer()
    screen = new IdlePresenter(game)
    screen.redirect = jest.fn()
  })

  it('opens inventory screen', () => {
    screen.onInput(IdleInputKey.Inventory)
    expect(screen.redirect.mock.calls.length).toBe(1)
    expect(screen.redirect.mock.calls[0][0]).toBeInstanceOf(InventoryPresenter)
  })
})
