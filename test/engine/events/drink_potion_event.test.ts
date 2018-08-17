import { generateGame, generatePlayer } from '../helpers'
import { Potion, Game, DrinkPotionEvent } from '../../../src/engine'

class TestPotion extends Potion {
  public onDrink(game: Game): void {}
}

describe('Drink potion event', () => {
  let potion = new TestPotion('Test potion'),
    player = generatePlayer(),
    game,
    event

  beforeEach(() => {
    player.inventory.putToBag(potion, 1)
    potion.onDrink = jest.fn()
    game = generateGame()
    event = new DrinkPotionEvent(potion, game)
  })

  it('removes potion from inventory', () => {
    expect(player.inventory.findInBag(potion)).toBeTruthy()
    player.on(event)
    expect(player.inventory.findInBag(potion)).toBeFalsy()
  })

  it('adds a message to log', () => {
    expect(game.logger.messages.length).toEqual(0)
    player.on(event)
    expect(game.logger.messages.length).toEqual(1)
  })

  it('calls potion drink effect', () => {
    player.on(event)
    expect(potion.onDrink.mock.calls.length).toEqual(1)
  })
})
