import {
  generateGame,
  generatePlayer,
  generateOneHandedWeapon,
} from '../../helpers'
import { TakeOffItemEvent, LeftHandSlot, Player } from '../../../src/engine'

describe('Taking item off event', () => {
  let item = generateOneHandedWeapon(),
    player: Player,
    game,
    event,
    slot: LeftHandSlot

  beforeEach(() => {
    player = generatePlayer()
    game = generateGame()
    player.inventory.putToBag(item, 1)
    slot = player.inventory.leftHandSlot
    slot.equip(player, item)
    event = new TakeOffItemEvent(slot, game)
  })

  it('removes item from inventory', () => {
    expect(player.inventory.findInBag(item)).toBeFalsy()
    player.on(event)
    expect(player.inventory.findInBag(item)).toBeTruthy()
  })

  it('adds item to bag', () => {
    expect(player.inventory.leftHandSlot.equipment).toBeTruthy()
    player.on(event)
    expect(player.inventory.leftHandSlot.equipment).toBeFalsy()
  })

  it('adds a message to log', () => {
    expect(game.logger.messages.length).toEqual(0)
    player.on(event)
    expect(game.logger.messages.length).toEqual(1)
  })
})
