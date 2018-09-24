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
} from '../../engine'
import { creaturesPool1 } from '../creatures'

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

    centralize(map)

    // addItems(0.05, map, weapons.merge(itemsPool))

    return map
  }
}
