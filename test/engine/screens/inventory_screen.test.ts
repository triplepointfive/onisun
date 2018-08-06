import { Player, InventoryScreen, IdleScreen } from '../../../src/engine'

import { generateGame, TestGame, generatePlayer } from '../../helpers'

describe('puts on and takes off', () => {
  let game: TestGame = generateGame(),
    player: Player,
    screen: InventoryScreen

  beforeEach(() => {
    game.player = player = generatePlayer()
    game.screen = screen = new InventoryScreen(game)
  })

  it('closes inventory', () => {
    screen.close()
    expect(game.screen).toBeInstanceOf(IdleScreen)
  })
})
