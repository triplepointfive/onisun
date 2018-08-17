import {
  generateGame,
  generatePlayer,
  generateOneHandedWeapon,
  generateLevelMap,
} from '../../helpers'
import { PickUpItemsEvent, Player, LevelMap, Point, GroupedItem, Tile } from '../../../src/engine'

describe('Taking item off event', () => {
  let item = generateOneHandedWeapon(),
    player: Player,
    game,
    event,
    map: LevelMap,
    tile: Tile

  beforeEach(() => {
    player = generatePlayer()
    game = generateGame()
    map = generateLevelMap()
    player.addToMap(new Point(1, 1), map)
    tile = map.at(1, 1)
    tile.addItem(item, 10)

    event = new PickUpItemsEvent(tile, [new GroupedItem(5, item)], game)
  })

  it('removes item from floor', () => {
    expect(tile.items.find(item)).toBeTruthy()
    expect(tile.items.find(item).count).toEqual(10)
    player.on(event)
    expect(tile.items.find(item)).toBeTruthy()
    expect(tile.items.find(item).count).toEqual(5)
  })

  it('adds items to bag', () => {
    expect(player.inventory.findInBag(item)).toBeFalsy()
    player.on(event)
    expect(player.inventory.findInBag(item)).toBeTruthy()
    expect(player.inventory.findInBag(item).count).toEqual(5)
  })

  it('adds a message to log', () => {
    expect(game.logger.messages.length).toEqual(0)
    player.on(event)
    expect(game.logger.messages.length).toEqual(1)
  })
})

