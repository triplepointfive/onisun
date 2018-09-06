import {
  generateGame,
  generateLevelMap,
  generatePlayer,
  generateCreature,
  generateItem,
} from '../helpers'
import {
  LookPresenter,
  Game,
  LevelMap,
  Player,
  Point,
  Direction,
  IdlePresenter,
  LookPresenterVisibility,
} from '../../../src/engine'

describe('LookPresenter', () => {
  let presenter: LookPresenter, game: Game, map: LevelMap, player: Player

  beforeEach(() => {
    game = generateGame()
    game.player = player = generatePlayer()
    game.currentMap = map = generateLevelMap()

    map.addCreature(new Point(1, 1), player)

    player.specie.visionRadius = 5
    player.visionMask(map)
    player.specie.visionRadius = 3
    player.visionMask(map)

    player.on = jest.fn()

    presenter = new LookPresenter(map, game)

    presenter.redirect = jest.fn()
  })

  describe('sets properties', () => {
    it('when on player', () => {
      expect(presenter.title).toEqual(LookPresenterVisibility.See)
      expect(presenter.body).toEqual(['Это я'])
    })

    it('when tile with a creature and an item', () => {
      const creature = generateCreature(),
        pos = new Point(1, 3),
        item = generateItem()

      map.addCreature(pos, creature)
      presenter.targetPos = pos

      map.at(pos.x, pos.y).addItem(item, 1)

      player.visionMask(map)

      expect(presenter.body).toEqual([
        `Это ${creature.name}`,
        `Лежит ${item.name}`,
      ])
    })

    it('when on tile that is not visible anymore with multiple items', () => {
      const pos = new Point(1, 6),
        item1 = generateItem(),
        item2 = generateItem()

      presenter.targetPos = pos

      map.at(pos.x, pos.y).addItem(item1, 1)
      map.at(pos.x, pos.y).addItem(item2, 1)

      player.specie.visionRadius = 5
      player.visionMask(map)
      player.specie.visionRadius = 3
      player.visionMask(map)

      expect(presenter.title).toEqual(LookPresenterVisibility.Recall)
      expect(presenter.body).toEqual(['Лежит несколько предметов'])
    })

    it('when on tile that is not discovered yet', () => {
      presenter.targetPos = new Point(1, 8)
      expect(presenter.title).toEqual(LookPresenterVisibility.Hidden)
      expect(presenter.body).toEqual([])
    })
  })

  it('cannot move cursor out of map', () => {
    expect(presenter.targetPos.eq(new Point(1, 1))).toBeTruthy()

    presenter.moveTarget(Direction.up)
    expect(presenter.targetPos.eq(new Point(1, 0))).toBeTruthy()

    presenter.moveTarget(Direction.up)
    expect(presenter.targetPos.eq(new Point(1, 0))).toBeTruthy()

    presenter.act()

    expect(presenter.redirect).toHaveBeenCalled()
    expect(presenter.redirect.mock.calls[0][0]).toBeInstanceOf(IdlePresenter)
  })
})
