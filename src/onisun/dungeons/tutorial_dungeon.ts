import {
  addCreatures,
  addDoors,
  addItems,
  addOnTile,
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
} from '../../engine'
import { creaturesPool1 } from '../creatures'
import { itemsPool, weapons } from '../items'
import { OnisunFireTrap, OnisunIceTrap } from '../tiles'

const initId: number = -1

const config = {
  addDoors: false,
  minSize: 3,
  maxSize: 10,
  roomsCount: 10,
  simple: true,
}

const tiles: Map<string, () => Tile> = new Map()
tiles.set('C', () => new Corridor('C', TileTypes.Floor))
tiles.set('W', () => new Wall())
tiles.set('R', () => new Floor('R', TileTypes.Floor))
tiles.set('D', () => new Door())

export class TutorialDungeon extends Dungeon {
  public enter(initPlayer: (enterPoint: Point, levelMap: LevelMap) => Player): void {
    const levelMap = game.currentMap = game.getMap(initId)

    addOnTile(
      levelMap,
      tile => tile.isFloor() && tile.passibleThrough(),
      (x, y) => {
        // this.game.player.addToMap(new Point(x, y), this.game.currentMap)
        game.player.addToMap(new Point(1, 2), levelMap)
      }
    )
  }

  public register(game: Game): void {
    game.addMap(-1, (id, game) =>
      addCreatures(
        0.1,
        this.addStairDown(this.generateMap(id), 0),
        creaturesPool1
      )
    )

    for (let i = 0; i < 5; i++) {
      game.addMap(i, (id, game) => {
        return addCreatures(
          i * 0.01,
          this.addStairUp(
            this.addStairDown(this.generateMap(id), i + 1),
            i - 1
          ),
          creaturesPool1
        )
      })
    }

    game.addMap(5, (id, game) => this.addStairUp(this.generateMap(id), 4))
  }

  private generateMap(id: number): LevelMap {
    let map = new LevelMap(
      id,
      dungeon<Tile>(
        40,
        30,
        config.minSize,
        config.maxSize,
        config.roomsCount,
        () => new Room(),
        () => new Corridor('C', TileTypes.Floor),
        () => new Wall()
      )
    )

    if (config.simple) {
      map = new LevelMap(
        id,
        drawn(
          [
            'WWWWWWWWWWWWWWWWWWWWWW',
            'WRRRRRRRRRRRRRRRRRRRRW',
            'WRRRRRRRRRRRRRRRRRRRRW',
            'WRRRRRRRRRRRRRRRRRRRRW',
            'WRRRRRRRRRRRRRRRRRRRRW',
            'WRRRRRRRRRRRRRRRRRRRRW',
            'WWWWWWWWWWWWWWWWWWWWWW',
          ],
          tiles
        )
      )
    }

    if (config.addDoors) {
      const door = tiles.get('D')
      if (door === undefined) {
        throw 'Door is not found'
      }

      addDoors(map, door)
    }

    centralize(map)
    map.name = `MP ${id}`

    for (let i = 0; i < 10; i++) {
      addOnTile(
        map,
        tile => tile.isFloor() && tile.passibleThrough(),
        (x, y) => {
          map.setTile(x, y, new OnisunFireTrap())
        }
      )

      addOnTile(
        map,
        tile => tile.isFloor() && tile.passibleThrough(),
        (x, y) => {
          map.setTile(x, y, new OnisunIceTrap())
        }
      )
    }

    addItems(0.05, map, weapons.merge(itemsPool))

    return map
  }
}
