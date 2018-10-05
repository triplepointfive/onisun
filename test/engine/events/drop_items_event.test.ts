import {
  generateGame,
  generatePlayer,
  generateOneHandedWeapon,
  generateLevelMap,
  generateCreature,
} from '../helpers'
import {
  DropItemsEvent,
  Player,
  LevelMap,
  Point,
  Tile,
  Game,
  Creature,
} from '../../../src/engine'

describe('Drop items event', () => {
  let item = generateOneHandedWeapon(),
    player: Player,
    game: Game,
    event,
    map: LevelMap,
    tile: Tile

  beforeEach(() => {
    player = generatePlayer()
    game = generateGame()
    game.currentMap = map = generateLevelMap()

    map.addCreature(new Point(1, 1), player)

    player.inventory.putToBag(item, 10)
    tile = map.at(1, 1)

    event = new DropItemsEvent(tile, [{ count: 5, item }], game)
  })

  it('creature', () => {
    let creature: Creature = generateCreature()
    map.addCreature(new Point(1, 1), creature)

    creature.addItem(item, 5)

    event = new DropItemsEvent(tile, [{ count: 5, item }], game)

    creature.on(event)
    expect(creature.bag).toBeDefined()
    expect(creature.bag.bunch.length).toEqual(0)
  })

  it('adds items to floor', () => {
    expect(tile.items).toBeFalsy()
    player.on(event)
    expect(tile.items.find(item)).toBeTruthy()
    expect(tile.items.find(item).count).toEqual(5)
  })

  it('removes items from bag', () => {
    expect(player.inventory.findInBag(item)).toBeTruthy()
    expect(player.inventory.findInBag(item).count).toEqual(10)
    player.on(event)
    expect(player.inventory.findInBag(item)).toBeTruthy()
    expect(player.inventory.findInBag(item).count).toEqual(5)
  })

  it('adds a message to log', () => {
    expect(game.logger.messages.length).toEqual(0)
    player.on(event)
    expect(game.logger.messages.length).toEqual(1)
  })

  it('removes weights', () => {
    const oldWeight = player.stuffWeight.current
    player.on(event)
    expect(player.stuffWeight.current).toEqual(oldWeight - 5 * item.weight)
  })
})
