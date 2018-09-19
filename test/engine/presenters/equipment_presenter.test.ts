import {
  Player,
  EquipmentPresenter,
  IdlePresenter,
  PutOnItemsPresenter,
} from '../../../src/engine'

import {
  generateGame,
  TestGame,
  generatePlayer,
  generateLevelMap,
  generateOneHandedWeapon,
} from '../helpers'

describe('EquipmentPresenter', () => {
  let game: TestGame = generateGame(),
    player: Player,
    presenter: EquipmentPresenter

  beforeEach(() => {
    game.player = player = generatePlayer()
    player.inventory.leftHandSlot.equip(generateOneHandedWeapon(), 1)

    presenter = new EquipmentPresenter(generateLevelMap(), game)
    jest.spyOn(presenter, 'redirect')
    presenter.endTurn = jest.fn()
  })

  it('closes inventory', () => {
    presenter.close()

    expect(presenter.redirect).toHaveBeenCalled()
    expect(presenter.redirect.mock.calls[0][0]).toBeInstanceOf(IdlePresenter)
  })

  it('takes off an item and closes', () => {
    const item = generateOneHandedWeapon(),
      slot = player.inventory.rightHandSlot

    slot.equip(item, 1)

    presenter.takeOff({
      inventorySlot: slot,
      item: item,
      count: 1,
      availableItems: [],
    })

    expect(slot.equipment).toBeUndefined()

    presenter.close()

    expect(presenter.redirect).not.toHaveBeenCalled()
    expect(presenter.endTurn).toHaveBeenCalled()
  })

  it('puts an item on and closes', () => {
    const item = generateOneHandedWeapon(),
      slot = player.inventory.rightHandSlot

    player.addItem(item, 1)

    presenter.putOn({
      inventorySlot: slot,
      item: item,
      count: 1,
      availableItems: [],
    })

    expect(presenter.redirect).toHaveBeenCalled()

    expect(game.player.ai.presenter).toBeInstanceOf(PutOnItemsPresenter)
    game.player.ai.presenter.withItem({ item, count: 1 })

    expect(presenter.endTurn).not.toHaveBeenCalled()
    expect(presenter.redirect).toHaveBeenCalledTimes(2)
    expect(slot.equipment).toBeDefined()

    presenter.close()

    expect(presenter.redirect).toHaveBeenCalledTimes(2)
    expect(presenter.endTurn).toHaveBeenCalled()
  })
})
