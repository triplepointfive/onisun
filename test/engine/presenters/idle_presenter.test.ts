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
  PutOnItemEvent,
  LookPresenter,
  AttackEvent,
  Direction,
  StayEvent,
  ImpactType,
} from '../../../src/engine'

import {
  generateGame,
  generateLevelMap,
  TestGame,
  generatePlayer,
  generateItem,
  generateMissile,
  generateCreature,
} from '../helpers'
import { MissilePresenter } from '../../../src/engine/presenters/missile_presenter'

const level0 = 0,
  level1 = 1,
  fakeStairPos = new Point(1, 1)

class TestDungeon extends Dungeon {
  public register(game: Game): void {
    game.addMap(level0, (id, game) =>
      this.addStairDown(this.newMap(id), level1)
    )
    game.addMap(level1, (id, game) => this.addStairUp(this.newMap(id), level0))
  }

  public enter(game: Game, player: Player): void {
    game.currentMap = game.getMap(0)
    game.currentMap.addCreature(new Point(1, 1), player)
  }

  private newMap(id): LevelMap {
    return generateLevelMap(undefined, id)
  }
}

describe('IdlePresenter', () => {
  let game: TestGame, player: Player, presenter: IdlePresenter, map: LevelMap

  beforeEach(() => {
    game = generateGame()
    game.currentMap = map = generateLevelMap()

    game.player = player = generatePlayer()
    game.ai = player.ai
    map.addCreature(fakeStairPos, player)

    presenter = new IdlePresenter(map, game)
    presenter.redirect = jest.fn()

    jest.spyOn(presenter, 'endTurn')
  })

  it('opens inventory screen', () => {
    presenter.inventoryCommand()
    expect(presenter.redirect.mock.calls.length).toBe(1)
    expect(presenter.redirect.mock.calls[0][0]).toBeInstanceOf(
      InventoryPresenter
    )
  })

  it('opens bag screen', () => {
    presenter.bagCommand()
    expect(presenter.redirect.mock.calls.length).toBe(1)
    expect(presenter.redirect.mock.calls[0][0]).toBeInstanceOf(BagPresenter)
  })

  it('opens drink screen', () => {
    presenter.drinkCommand()
    expect(presenter.redirect.mock.calls.length).toBe(1)
    expect(presenter.redirect.mock.calls[0][0]).toBeInstanceOf(DrinkPresenter)
  })

  it('opens drop screen', () => {
    presenter.dropCommand()
    expect(presenter.redirect.mock.calls.length).toBe(1)
    expect(presenter.redirect.mock.calls[0][0]).toBeInstanceOf(
      DropItemsPresenter
    )
  })

  it('waits', () => {
    player.on = jest.fn()
    presenter.stayCommand()

    expect(player.on).toHaveBeenCalled()
    expect(player.on.mock.calls[0][0]).toBeInstanceOf(StayEvent)

    expect(presenter.redirect).not.toHaveBeenCalled()
    expect(presenter.endTurn).toHaveBeenCalled()
  })

  it('look', () => {
    presenter.lookCommand()

    expect(presenter.endTurn).not.toHaveBeenCalled()
    expect(presenter.redirect).toHaveBeenCalled()
    expect(presenter.redirect.mock.calls[0][0]).toBeInstanceOf(LookPresenter)
  })

  describe('moving', () => {
    it('into a wall', () => {
      player.addImpact(ImpactType.Blind, 'test')

      const wallPos = fakeStairPos.add(Direction.up)
      expect(player.stageMemory(map).at(wallPos.x, wallPos.y).seen).toBeFalsy()

      presenter.move(Direction.up)

      expect(player.stageMemory(map).at(wallPos.x, wallPos.y).seen).toBeTruthy()
      expect(presenter.endTurn).toHaveBeenCalled()
      expect(game.logger.messages.length).toEqual(1)
      expect(map.creaturePos(player)).toEqual(fakeStairPos)
    })

    it('on free space', () => {
      presenter.move(Direction.down)

      expect(presenter.endTurn).toHaveBeenCalled()
      expect(map.creaturePos(player)).toEqual(new Point(1, 2))
    })

    it('on cell with creature', () => {
      let creature = generateCreature()

      map.addCreature(fakeStairPos.add(new Point(1, 0)), creature)

      player.on = jest.fn()

      presenter.move(Direction.right)

      expect(presenter.endTurn).toHaveBeenCalled()
      expect(map.creaturePos(player)).toEqual(fakeStairPos)

      expect(player.on).toHaveBeenCalled()
      expect(player.on.mock.calls[0][0]).toBeInstanceOf(AttackEvent)
    })
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

      game.ai.act(player, map, game)

      expect(game.logger.messages.length).toEqual(0)
      presenter.handleCommand()
      expect(game.logger.messages.length).toEqual(1)

      expect(presenter.redirect).not.toHaveBeenCalled()
      expect(presenter.endTurn).not.toHaveBeenCalled()
    })

    it('handles stairs', () => {
      presenter = new IdlePresenter(game.currentMap, game)
      presenter.redirect = jest.fn()
      presenter.endTurn = jest.fn()

      game.getMap(level0).addCreature(stairPos, player)
      game.ai.act(player, map, game)

      presenter.handleCommand()
      expect(game.logger.messages.length).toEqual(0)

      expect(presenter.redirect).not.toHaveBeenCalled()
      expect(presenter.endTurn).toHaveBeenCalled()
    })
  })

  describe('on pick up', () => {
    it('logs when there is nothing to pick up', () => {
      presenter.pickUpCommand()

      expect(game.logger.messages.length).toEqual(1)
      expect(presenter.redirect).not.toHaveBeenCalled()
      expect(presenter.endTurn).not.toHaveBeenCalled()
    })

    it('picks up single item', () => {
      map.at(1, 1).addItem(generateItem(), 1)
      player.on = jest.fn()
      presenter.pickUpCommand()

      expect(game.logger.messages.length).toEqual(0)
      expect(presenter.redirect.mock.calls.length).toBe(0)
      expect(presenter.endTurn.mock.calls.length).toBe(1)
      expect(player.on.mock.calls.length).toEqual(1)
      expect(player.on.mock.calls[0][0]).toBeInstanceOf(PickUpItemsEvent)
    })

    it('opens pickup dialog for multiple items', () => {
      map.at(1, 1).addItem(generateItem(), 1)
      map.at(1, 1).addItem(generateItem(), 1)
      presenter.pickUpCommand()

      expect(presenter.redirect).toHaveBeenCalled()
      expect(presenter.endTurn).not.toHaveBeenCalled()
    })
  })

  describe('for missiles', () => {
    let missile: Missile

    beforeEach(() => {
      missile = generateMissile()
    })

    it('complains when no missile equipped', () => {
      presenter.missileCommand()

      expect(game.logger.messages.length).toEqual(1)
      expect(presenter.redirect.mock.calls.length).toBe(0)
      expect(presenter.endTurn.mock.calls.length).toBe(0)
    })

    it('complains when can not use missile', () => {
      player.inventory.putToBag(missile, 5)
      player.on(new PutOnItemEvent(player.inventory.missileSlot, missile, game))

      missile.canThrow = jest.fn()
      missile.canThrow.mockReturnValueOnce(false)

      presenter.missileCommand()

      expect(game.logger.messages.length).toEqual(2)
      expect(presenter.redirect.mock.calls.length).toBe(0)
      expect(presenter.endTurn.mock.calls.length).toBe(0)
    })

    it('opens missile screen', () => {
      player.inventory.putToBag(missile, 5)
      player.on(new PutOnItemEvent(player.inventory.missileSlot, missile, game))
      map.addCreature(new Point(1, 1), player)
      player.rebuildVision(game.currentMap)

      presenter.missileCommand()

      expect(game.logger.messages.length).toEqual(1)
      expect(presenter.redirect.mock.calls.length).toBe(1)
      expect(presenter.redirect.mock.calls[0][0]).toBeInstanceOf(
        MissilePresenter
      )
      expect(presenter.endTurn.mock.calls.length).toBe(0)
    })
  })
})
