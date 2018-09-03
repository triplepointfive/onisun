import {
  generateGame,
  generatePlayer,
  generateOneHandedWeapon,
  generateBodyArmor,
} from '../helpers'
import {
  TakeOffItemEvent,
  LeftHandSlot,
  Player,
  PutOnItemEvent,
  Armor,
} from '../../../src/engine'

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
    player.on(new PutOnItemEvent(slot, item, game))
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
    expect(game.logger.messages.length).toEqual(1)
    player.on(event)
    expect(game.logger.messages.length).toEqual(2)
  })

  it('removes damage from player', () => {
    expect(player.itemsDamages.length).toEqual(1)
    player.on(event)
    expect(player.itemsDamages.length).toEqual(0)
  })

  describe('with armor', () => {
    beforeEach(() => {
      let armor = generateBodyArmor()
      player.inventory.putToBag(armor, 1)
      player.on(new PutOnItemEvent(player.inventory.chestSlot, armor, game))
      event = new TakeOffItemEvent(player.inventory.chestSlot, game)
    })

    it('adds protection to player', () => {
      expect(player.itemsProtections.length).toEqual(1)
      player.on(event)
      expect(player.itemsProtections.length).toEqual(0)
    })
  })
})
