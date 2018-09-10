import {
  Corridor,
  Door,
  drawn,
  Dungeon,
  Floor,
  LevelMap,
  Point,
  Tile,
  TileTypes,
  Wall,
  Game,
  Player,
  StairwayDown,
  StairwayUp,
  LogMessageTrigger,
  TeleportationTrap,
  Room,
  LightTrap,
  HoleTrap,
} from '../../engine'
import { rat, golem } from '../creatures'
import { BareWireTrap } from '../../engine/models/traps/bare_wire_trap'

const tiles: Map<string, () => Tile> = new Map()
tiles.set('C', () => new Corridor('C', TileTypes.Floor))
tiles.set('W', () => new Wall())
tiles.set('R', () => new Floor('R', TileTypes.Floor))
tiles.set('D', () => new Door())

const initId: number = 1,
  secondId = initId + 1

export class TutorialDungeon extends Dungeon {
  public enter(game: Game, player: Player): void {
    const levelMap = (game.currentMap = game.getMap(initId))

    levelMap.addCreature(new Point(5, 10), player)
  }

  public register(game: Game): void {
    game.addMap(initId, (id, game) => {
      let map = this.generateMap(id, [
        'WWWWWWWWWWW',
        'WWWWRRRWWWW',
        'WWWWRRRWWWW',
        'WWWWRRRWWWW',
        'WWWWWCWWWWW',
        'WRRRWCWRRRW',
        'WRRRCCCRRRW',
        'WRRRWCWRRRW',
        'WWWWWCWWWWW',
        'WRRRWCWRRRW',
        'WRRRCCCRRRW',
        'WRRRWCWRRRW',
        'WWWWWCWWWWW',
        'WRRRWCWRRRW',
        'WRRRCCCRRRW',
        'WRRRWCWRRRW',
        'WWWWWCWWWWW',
        'WRRRWCWRRRW',
        'WRRRCCCRRRW',
        'WRRRWCWRRRW',
        'WWWWWCWWWWW',
        'WRRRWCWRRRW',
        'WRRRCCCRRRW',
        'WRRRWCWRRRW',
        'WWWWWCWWWWW',
        'WRRRWCWRRRW',
        'WRRRCCCRRRW',
        'WRRRWCWRRRW',
        'WWWWWWWWWWW',
      ])
      map.name = 'Traps'

      map.setTile(
        4,
        6,
        new LogMessageTrigger('Teleportation trap', false, new Room())
      )
      map.setTile(2, 6, new TeleportationTrap(new Room()))

      map.setTile(6, 6, new LogMessageTrigger('Light trap', false, new Room()))
      map.setTile(8, 6, new LightTrap(new Room()))

      map.setTile(4, 10, new LogMessageTrigger('Hole trap', false, new Room()))
      map.setTile(2, 10, new HoleTrap(new Room()))

      map.setTile(6, 10, new LogMessageTrigger('Bare wire', false, new Room()))
      map.setTile(8, 10, new BareWireTrap(new Room()))

      map.setTile(5, 2, new StairwayDown(map, secondId))

      return map
    })

    game.addMap(secondId, (id, game) => {
      let map = this.generateMap(id, [
        'WWWWW',
        'WRRRW',
        'WRRRW',
        'WRRRW',
        'WWWWW',
      ])
      map.name = '2nd'

      map.setTile(2, 1, new StairwayUp(map, initId))

      map.addCreature(new Point(1, 1), golem())

      return map
    })
  }

  private generateMap(id: number, scheme: string[]): LevelMap {
    let map = new LevelMap(id, drawn(scheme, tiles))

    return map
  }
}
