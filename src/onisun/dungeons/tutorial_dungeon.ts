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
import { FallingRockTrap } from '../../engine/models/traps/falling_rock_trap'
import { smallRock } from '../items'
import { WaterTrap } from '../../engine/models/traps/water_trap'
import { AirBlowTrap } from '../../engine/models/traps/air_blow_trap'

const tiles: Map<string, () => Tile> = new Map()
tiles.set('C', () => new Corridor('C', TileTypes.Floor))
tiles.set('W', () => new Wall())
tiles.set('R', () => new Floor('R', TileTypes.Floor))
tiles.set('D', () => new Door())

const trapsLevel = 'Traps',
  secondLevel = '2nd'

export class TutorialDungeon extends Dungeon {
  public enter(game: Game, player: Player): void {
    const levelMap = (game.currentMap = game.getMap(trapsLevel))

    levelMap.addCreature(new Point(3, 27), player)
  }

  public register(game: Game): void {
    game.addMap(trapsLevel, (name, game) => {
      let map = this.generateMap(name, [
        'WWWWWWWWWWWWW',
        'WWWWRRRWWWWWW',
        'WWWWRRRWWWWWW',
        'WWWWRRRWWWWWW',
        'WWWWWCWWWWWWW',
        'WRRRWCWRRRWWW',
        'WRRRCCCRRRWWW',
        'WRRRWCWRRRWWW',
        'WWWWWCWWWWWWW',
        'WRRRWCWRRRWWW',
        'WRRRCCCRRRWWW',
        'WRRRWCWRRRWWW',
        'WWWWWCWWWWWWW',
        'WRRRWCWRRRWWW',
        'WRRRCCCRRRWWW',
        'WRRRWCWRRRWWW',
        'WWWWWCWWWWWWW',
        'WRRRWCWRRRWWW',
        'WRRRCCCRRRWWW',
        'WRRRWCWRRRWWW',
        'WWWWWCWWWWWWW',
        'WRRRWCWRRRWWW',
        'WRRRCCCRRRWWW',
        'WRRRWCWRRRWWW',
        'WWWWWCWWWWWWW',
        'WWWWWCWRRRRRW',
        'WRRRWCWRRRRRW',
        'WRRRCCCRRRRRW',
        'WRRRWCWRRRRRW',
        'WWWWWCWRRRRRW',
        'WWWWWWWWWWWWW',
      ])

      map.setTile(5, 2, new StairwayDown(map, secondLevel))

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

      map.setTile(4, 14, new LogMessageTrigger('Water trap', false, new Room()))
      map.setTile(2, 14, new WaterTrap(new Room()))

      map.setTile(
        6,
        14,
        new LogMessageTrigger('Falling rock trap', false, new Room())
      )
      map.setTile(8, 14, new FallingRockTrap(smallRock, new Room()))

      map.setTile(
        6,
        27,
        new LogMessageTrigger('Air blow trap', false, new Room())
      )
      map.setTile(9, 27, new AirBlowTrap(new Room()))

      return map
    })

    game.addMap(secondLevel, (name, game) => {
      let map = this.generateMap(name, [
        'WWWWW',
        'WRRRW',
        'WRRRW',
        'WRRRW',
        'WWWWW',
      ])

      map.setTile(2, 1, new StairwayUp(map, trapsLevel))

      map.addCreature(new Point(1, 1), golem())

      return map
    })
  }

  private generateMap(name: string, scheme: string[]): LevelMap {
    let map = new LevelMap(name, drawn(scheme, tiles))
    return map
  }
}
