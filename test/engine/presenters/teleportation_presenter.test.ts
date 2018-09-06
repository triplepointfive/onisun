import { generateGame, generateLevelMap, generatePlayer } from '../helpers'
import {
  TeleportationPresenter,
  Game,
  LevelMap,
  Player,
  Point,
  Direction,
} from '../../../src/engine'

describe('TeleportationPresenter', () => {
  let presenter: TeleportationPresenter,
    game: Game,
    map: LevelMap,
    player: Player

  beforeEach(() => {
    game = generateGame()
    game.player = player = generatePlayer()
    game.currentMap = map = generateLevelMap()

    map.addCreature(new Point(1, 1), player)

    player.visionMask(map)
    player.on = jest.fn()

    presenter = new TeleportationPresenter(map, game)

    presenter.endTurn = jest.fn()
  })

  it('sets properties', () => {
    expect(presenter.title).toBeDefined()
    expect(presenter.body).toEqual([])
  })

  describe('moving cursor', () => {
    beforeEach(() => {
      expect(presenter.targetPos.eq(new Point(1, 1))).toBeTruthy()
    })

    afterEach(() => {
      expect(presenter.endTurn).toHaveBeenCalled()
    })

    it('cannot move into a wall', () => {
      presenter.moveTarget(Direction.left)
      expect(presenter.targetPos.eq(new Point(1, 1))).toBeTruthy()

      presenter.act()

      expect(player.on).not.toHaveBeenCalled()
      expect(game.logger.messages.length).toEqual(1)
    })

    it('can move on a floor tile', () => {
      presenter.moveTarget(Direction.right)
      expect(presenter.targetPos.eq(new Point(2, 1))).toBeTruthy()

      presenter.act()

      expect(player.on).toHaveBeenCalled()
      expect(game.logger.messages.length).toEqual(0)
    })
  })
})
