import {
  IdleScreen,
  IdleInputKey,
  Player,
  InventoryScreen,
} from '../../../src/engine'

import { generateGame, TestGame, generatePlayer } from '../../helpers'

describe('puts on and takes off', () => {
  let game: TestGame = generateGame(),
    player: Player,
    screen: IdleScreen

  beforeEach(() => {
    game.player = player = generatePlayer()
    game.screen = screen = new IdleScreen(game)
  })

  it('opens inventory screen', () => {
    screen.onInput(IdleInputKey.Inventory)
    expect(game.screen).toBeInstanceOf(InventoryScreen)
  })
})
