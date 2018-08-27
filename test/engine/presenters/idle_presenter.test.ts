import {
  IdlePresenter,
  IdleInputKey,
  Player,
  InventoryPresenter,
  Dungeon,
  Point,
  LevelMap,
  BagPresenter,
  DrinkPresenter,
  DropItemsPresenter,
  PickUpItemsEvent,
  Missile,
  Game,
} from '../../../src/engine'

import {
  generateGame,
  generateLevelMap,
  TestGame,
  generatePlayer,
  generateItem,
  generateMissile,
} from '../helpers'
import { MissilePresenter } from '../../../src/engine/presenters/missile_presenter'

const level0 = 0,
  level1 = 1,
  fakeStairPos = new Point(1, 1)

class TestDungeon extends Dungeon {
  public register(game: Game): void {
    game.addMap(level0, (id, game) => this.addStairDown(this.newMap(), level1))
    game.addMap(level1, (id, game) => this.addStairUp(this.newMap(), level0))
  }

  public enter(game: Game, player: Player): void {
    game.currentMap = game.getMap(0)
    game.currentMap.addCreature(new Point(1, 1), player)
  }

  private newMap(): LevelMap {
    return generateLevelMap()
  }
}

describe('IdlePresenter', () => {
  let game: TestGame, player: Player, screen: IdlePresenter

  beforeEach(() => {
    game = generateGame()
    game.player = player = generatePlayer()
    game.ai = player.ai

    screen = new IdlePresenter(game)
    screen.redirect = jest.fn()
    screen.endTurn = jest.fn()
  })

  it('opens inventory screen', () => {
    screen.onInput(IdleInputKey.Inventory)
    expect(screen.redirect.mock.calls.length).toBe(1)
    expect(screen.redirect.mock.calls[0][0]).toBeInstanceOf(InventoryPresenter)
  })

  it('opens bag screen', () => {
    screen.onInput(IdleInputKey.Bag)
    expect(screen.redirect.mock.calls.length).toBe(1)
    expect(screen.redirect.mock.calls[0][0]).toBeInstanceOf(BagPresenter)
  })

  it('opens drink screen', () => {
    screen.onInput(IdleInputKey.Drink)
    expect(screen.redirect.mock.calls.length).toBe(1)
    expect(screen.redirect.mock.calls[0][0]).toBeInstanceOf(DrinkPresenter)
  })

  it('opens drop screen', () => {
    screen.onInput(IdleInputKey.Drop)
    expect(screen.redirect.mock.calls.length).toBe(1)
    expect(screen.redirect.mock.calls[0][0]).toBeInstanceOf(DropItemsPresenter)
  })

  describe('handles', () => {
    let dungeon: TestDungeon, stairPos: Point

    beforeEach(() => {
      dungeon = new TestDungeon()
      dungeon.register(game)
      dungeon.enter(game, player)

      stairPos = game.getMap(level0).matchStairs(level1, fakeStairPos)
    })

    it('failed to handle common tile', () => {
      game.getMap(level0).addCreature(stairPos.add(fakeStairPos), player)

      game.ai.act(player, game)

      expect(game.logger.messages.length).toEqual(0)
      screen.onInput(IdleInputKey.Handle)
      expect(game.logger.messages.length).toEqual(1)

      expect(screen.redirect.mock.calls.length).toBe(0)
      expect(screen.endTurn.mock.calls.length).toBe(0)
    })

    it('handles stairs', () => {
      game.getMap(level0).addCreature(stairPos, player)
      game.ai.act(player, game)

      screen.onInput(IdleInputKey.Handle)
      expect(game.logger.messages.length).toEqual(0)

      expect(screen.redirect.mock.calls.length).toBe(0)
      expect(screen.endTurn.mock.calls.length).toBe(1)
    })
  })

  describe('on pick up', () => {
    let map: LevelMap,
      pos = new Point(1, 1)

    beforeEach(() => {
      game.currentMap = map = generateLevelMap()
      map.addCreature(pos, player)
    })

    it('logs when there is nothing to pick up', () => {
      screen.onInput(IdleInputKey.PickUp)

      expect(game.logger.messages.length).toEqual(1)
      expect(screen.redirect.mock.calls.length).toBe(0)
      expect(screen.endTurn.mock.calls.length).toBe(0)
    })

    it('picks up single item', () => {
      map.at(1, 1).addItem(generateItem(), 1)
      player.on = jest.fn()
      screen.onInput(IdleInputKey.PickUp)

      expect(game.logger.messages.length).toEqual(0)
      expect(screen.redirect.mock.calls.length).toBe(0)
      expect(screen.endTurn.mock.calls.length).toBe(1)
      expect(player.on.mock.calls.length).toEqual(1)
      expect(player.on.mock.calls[0][0]).toBeInstanceOf(PickUpItemsEvent)
    })

    it('opens pickup dialog for multiple items', () => {
      map.at(1, 1).addItem(generateItem(), 1)
      map.at(1, 1).addItem(generateItem(), 1)
      screen.onInput(IdleInputKey.PickUp)

      expect(screen.redirect.mock.calls.length).toBe(1)
      expect(screen.endTurn.mock.calls.length).toBe(0)
    })
  })

  describe('for missiles', () => {
    let missile: Missile

    beforeEach(() => {
      missile = generateMissile()
      game.currentMap = generateLevelMap()
      game.currentMap.addCreature(fakeStairPos, player)
    })

    it('complains when no missile equipped', () => {
      screen.onInput(IdleInputKey.Missile)

      expect(game.logger.messages.length).toEqual(1)
      expect(screen.redirect.mock.calls.length).toBe(0)
      expect(screen.endTurn.mock.calls.length).toBe(0)
    })

    it('complains when can not use missile', () => {
      player.inventory.putToBag(missile, 5)
      player.inventory.missileSlot.equip(player, missile)

      missile.canThrow = jest.fn()
      missile.canThrow.mockReturnValueOnce(false)

      screen.onInput(IdleInputKey.Missile)

      expect(game.logger.messages.length).toEqual(1)
      expect(screen.redirect.mock.calls.length).toBe(0)
      expect(screen.endTurn.mock.calls.length).toBe(0)
    })

    it('opens missile screen', () => {
      player.inventory.putToBag(missile, 5)
      player.inventory.missileSlot.equip(player, missile)
      generateLevelMap().addCreature(new Point(1, 1), player)
      player.rebuildVision(game.currentMap)

      screen.onInput(IdleInputKey.Missile)

      expect(game.logger.messages.length).toEqual(0)
      expect(screen.redirect.mock.calls.length).toBe(1)
      expect(screen.redirect.mock.calls[0][0]).toBeInstanceOf(MissilePresenter)
      expect(screen.endTurn.mock.calls.length).toBe(0)
    })
  })
})
