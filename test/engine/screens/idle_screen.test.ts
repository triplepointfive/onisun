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
    game.screen = screen = new IdlePresenter(game)
  })

  it('opens inventory screen', () => {
    screen.onInput(IdleInputKey.Inventory)
    expect(game.screen).toBeInstanceOf(InventoryPresenter)
  })
})
