import { Player, InventoryPresenter, IdlePresenter } from '../../../src/engine'

import { generateGame, TestGame, generatePlayer } from '../../helpers'

describe('puts on and takes off', () => {
  let game: TestGame = generateGame(),
    player: Player,
    screen: InventoryPresenter

  beforeEach(() => {
    game.player = player = generatePlayer()
    game.screen = screen = new InventoryPresenter(game)
  })

  it('closes inventory', () => {
    screen.close()
    expect(game.screen).toBeInstanceOf(IdlePresenter)
  })
})
