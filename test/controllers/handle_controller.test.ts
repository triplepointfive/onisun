import { generateGame, generateLevelMap, generatePlayer } from '../helpers'
import { Game, Dungeon, Player, Point, HandleController, LevelMap } from '../../src/engine'

const level0 = 0, level1 = 1, fakeStairPos = new Point(1, 1)

class TestDungeon extends Dungeon {
  public build(): void {
    this.game.addMap(
      level0, (id, game) => this.addStairDown(this.newMap(), level1)
    )
    this.game.addMap(
      level1, (id, game) => this.addStairUp(this.newMap(), level0)
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

describe('HandleController', () => {
  let game: Game, dungeon: TestDungeon, player: Player, stairPos: Point

  beforeEach(() => {
    game = generateGame()
    player = generatePlayer()
    game.player = player
    game.ai = player.ai

    dungeon = new TestDungeon(game)
    dungeon.build()
    dungeon.enter()

    stairPos = game.getMap(level0).matchStairs(level1, fakeStairPos)
  })

  it('failed to handle common tile', () => {
    player.addToMap(stairPos.add(fakeStairPos), game.getMap(level0))
    game.ai.act(player)

    expect(game.logger.messages.length).toEqual(0)
    new HandleController(game).act()
    expect(game.logger.messages.length).toEqual(1)
  })

  it('handles stairs', () => {
    player.addToMap(stairPos, game.getMap(level0))
    game.ai.act(player)

    new HandleController(game).act()
    expect(game.logger.messages.length).toEqual(0)
  })
})
