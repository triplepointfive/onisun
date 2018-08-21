import {
  IdlePresenter,
  IdleInputKey,
  Player,
  InventoryPresenter,
  Dungeon,
  Point,
  LevelMap,
} from '../../../src/engine'

import {
  generateGame,
  generateLevelMap,
  TestGame,
  generatePlayer,
} from '../helpers'

const level0 = 0,
  level1 = 1,
  fakeStairPos = new Point(1, 1)

class TestDungeon extends Dungeon {
  public build(): void {
    this.game.addMap(level0, (id, game) =>
      this.addStairDown(this.newMap(), level1)
    )
    this.game.addMap(level1, (id, game) =>
      this.addStairUp(this.newMap(), level0)
    )
  }

  public enter(): void {
    this.game.currentMap = this.game.getMap(0)
  }

  private newMap(): LevelMap {
    let map = generateLevelMap()
    map.game = this.game
    return map
  }
}

describe('puts on and takes off', () => {
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

  describe('handles', () => {
    let dungeon: TestDungeon, stairPos: Point

    beforeEach(() => {
      dungeon = new TestDungeon(game)
      dungeon.build()
      dungeon.enter()

      stairPos = game.getMap(level0).matchStairs(level1, fakeStairPos)
    })

    it('failed to handle common tile', () => {
      player.addToMap(stairPos.add(fakeStairPos), game.getMap(level0))
      game.ai.act(player, game)

      expect(game.logger.messages.length).toEqual(0)
      screen.onInput(IdleInputKey.Handle)
      expect(game.logger.messages.length).toEqual(1)

      expect(screen.redirect.mock.calls.length).toBe(0)
      expect(screen.endTurn.mock.calls.length).toBe(0)
    })

    it('handles stairs', () => {
      player.addToMap(stairPos, game.getMap(level0))
      game.ai.act(player, game)

      screen.onInput(IdleInputKey.Handle)
      expect(game.logger.messages.length).toEqual(0)

      expect(screen.redirect.mock.calls.length).toBe(0)
      expect(screen.endTurn.mock.calls.length).toBe(1)
    })
  })
})
