import { generatePlayer, generateMissile, generateGame } from '../helpers'
import {
  RemoveItemEvent,
  Player,
  Missile,
  Game,
  InventorySlot,
  TakeOffItemEvent,
} from '../../../src/engine'

describe('RemoveItemEvent', () => {
  let event: RemoveItemEvent,
    player: Player,
    missile: Missile,
    game: Game,
    slot: InventorySlot

  beforeEach(() => {
    game = generateGame()
    game.player = player = generatePlayer()

    slot = player.inventory.missileSlot
    missile = generateMissile()

    event = new RemoveItemEvent(slot, 1, game)
  })

  it('when slot is empty', () => {
    expect(() => player.on(event)).toThrow()
  })

  it('when slot has just match items', () => {
    slot.equip(missile, 1)

    let mock = jest.spyOn(player, 'on')

    player.on(event)

    expect(slot.equipment).toBeUndefined()
    expect(mock).toHaveBeenCalledTimes(2)
    expect(mock.mock.calls[1][0]).toBeInstanceOf(TakeOffItemEvent)
  })

  it('when there are more items than required', () => {
    slot.equip(missile, 2)

    let mock = jest.spyOn(player, 'on')

    player.on(event)

    expect(slot.equipment).toBeDefined()
    expect(mock).toHaveBeenCalledTimes(1)
  })
})
