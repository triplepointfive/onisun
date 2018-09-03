import {
  generateGame,
  generatePlayer,
  generateOneHandedWeapon,
  generateBodyArmor,
} from '../helpers'
import { PutOnItemEvent, Player, Armor } from '../../../src/engine'

describe('Put item on event', () => {
  let item = generateOneHandedWeapon(),
    player: Player,
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

  it('removes item from inventory', () => {
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

  it('adds damage to player', () => {
    expect(player.itemsDamages.length).toEqual(0)
    player.on(event)
    expect(player.itemsDamages.length).toEqual(1)
  })

  describe('with armor', () => {
    let armor: Armor

    beforeEach(() => {
      armor = generateBodyArmor()
      player.inventory.putToBag(armor, 1)
      event = new PutOnItemEvent(player.inventory.chestSlot, armor, game)
    })

    it('adds protection to player', () => {
      expect(player.itemsProtections.length).toEqual(0)
      player.on(event)
      expect(player.itemsProtections.length).toEqual(1)
    })
  })
})
