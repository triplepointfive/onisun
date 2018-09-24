import {
  addCreatures,
  addDoors,
  addItems,
  withMatchingTile,
  centralize,
  Corridor,
  Door,
  drawn,
  Dungeon,
  dungeon,
  Floor,
  LevelMap,
  Point,
  Room,
  Tile,
  TileTypes,
  Wall,
  Game,
  Player,
  Pool,
} from '../../engine'
import { creaturesPool1 } from '../creatures'
import { withEachTile } from '../../engine/lib/post';
import { AirBlowTrap } from '../../engine/models/traps/air_blow_trap';
import { BareWireTrap } from '../../engine/models/traps/bare_wire_trap';
import { FallingRockTrap } from '../../engine/models/traps/falling_rock_trap';
import { smallRock } from '../items';
import { HoleTrap } from '../../engine/models/traps/hole_trap';
import { LightTrap } from '../../engine/models/traps/light_trap';
import { TeleportationTrap } from '../../engine/models/traps/teleportation_trap';
import { WaterTrap } from '../../engine/models/traps/water_trap';

const titleId: string = 'title'

const config = {
  addDoors: false,
  minSize: 3,
  maxSize: 8,
  roomsCount: 20,
  addTraps: false,
  width: 100,
  height: 100,
}

const tiles: Map<string, () => Tile> = new Map()
tiles.set('C', () => new Corridor('C', TileTypes.Floor))
tiles.set('W', () => new Wall())
tiles.set('R', () => new Floor('R', TileTypes.Floor))
tiles.set('D', () => new Door())

const traps: Pool<Tile, Tile> = new Pool([
  [1, (tile: Tile): Tile => new AirBlowTrap(tile, false)],
  [1, (tile: Tile): Tile => new BareWireTrap(tile, false)],
  [1, (tile: Tile): Tile => new FallingRockTrap(smallRock, tile, false)],
  [1, (tile: Tile): Tile => new HoleTrap(tile, false)],
  [1, (tile: Tile): Tile => new LightTrap(tile, false)],
  [1, (tile: Tile): Tile => new TeleportationTrap(tile, false)],
  [1, (tile: Tile): Tile => new WaterTrap(tile, false)],
  [93, (tile: Tile): Tile => tile],
])

export class TitleDungeon extends Dungeon {
  public enter(game: Game, player: Player): void {
    const levelMap = (game.currentMap = game.getMap(titleId))

    withMatchingTile(
      levelMap,
      tile => tile.isFloor() && tile.passibleThrough(),
      (x, y) => {
        levelMap.addCreature(new Point(x, y), player)
      }
    )
  }

  public register(game: Game): void {
    game.addMap(titleId, (id, game) =>
      addCreatures(0, this.generateMap(titleId), creaturesPool1)
    )
  }

  private generateMap(name: string): LevelMap {
    let map = new LevelMap(
      name,
      dungeon<Tile>(
        config.width,
        config.height,
        config.minSize,
        config.maxSize,
        config.roomsCount,
        () => new Room(),
        () => new Corridor('C', TileTypes.Floor),
        () => new Wall()
      )
    )

    addDoors(map, () => new Door(), () => true)

    withEachTile(map, tile => tile.isFloor(), (tile, x, y) => {
      map.setTile(x, y, traps.pick(tile))
    })

    centralize(map)

    // addItems(0.05, map, weapons.merge(itemsPool))

    return map
  }
}
