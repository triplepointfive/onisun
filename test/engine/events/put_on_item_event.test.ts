import {
  generateGame,
  generatePlayer,
  generateOneHandedWeapon,
} from '../../helpers'
import {
  Potion,
  Game,
  DrinkPotionEvent,
  PutOnItemEvent,
} from '../../../src/engine'

describe('Put item on event', () => {
  let item = generateOneHandedWeapon(),
    player,
    game,
    event,
    slot

  beforeEach(() => {
    player = generatePlayer()
    player.inventory.putToBag(item, 1)
    game = generateGame()
    slot = player.inventory.leftHandSlot
    event = new PutOnItemEvent(slot, item, game)
  })

  it('removes potion from inventory', () => {
    expect(player.inventory.findInBag(item)).toBeTruthy()
    player.on(event)
    expect(player.inventory.findInBag(item)).toBeFalsy()
  })

  it('adds item to slot', () => {
    expect(player.inventory.leftHandSlot.equipment).toBeFalsy()
    player.on(event)
    expect(player.inventory.leftHandSlot.equipment).toBeTruthy()
  })

  it('adds a message to log', () => {
    expect(game.logger.messages.length).toEqual(0)
    player.on(event)
    expect(game.logger.messages.length).toEqual(1)
  })
})
