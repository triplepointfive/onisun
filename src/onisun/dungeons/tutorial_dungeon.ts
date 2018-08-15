import {
  Dungeon,
  addOnTile,
  Point,
  LevelMap,
  dungeon,
  addDoors,
  centralize,
  addItems,
  drawn,
  addCreatures,
} from '../../engine'
import { weapons, itemsPool } from '../items'
import { creaturesPool1 } from '../creatures'
import {
  Tile,
  TileTypes,
  Door,
  Wall,
  Floor,
  Corridor,
  Room,
} from '../../engine/tile'
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
  public enter(): void {
    this.game.currentMap = this.game.getMap(initId)

    addOnTile(
      this.game.currentMap,
      tile => tile.isFloor() && tile.passibleThrough(),
      (x, y) => {
        this.game.player.addToMap(new Point(x, y), this.game.currentMap)
      }
    )
  }

  public build(): void {
    this.game.addMap(-1, (id, game) =>
      addCreatures(
        0.1,
        this.addStairDown(this.generateMap(id), 0),
        creaturesPool1
      )
    )

    for (let i = 0; i < 5; i++) {
      this.game.addMap(i, (id, game) => {
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

    this.game.addMap(5, (id, game) => this.addStairUp(this.generateMap(id), 4))
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
      addDoors(map, tiles.get('D'))
    }
    centralize(map)
    map.game = this.game
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
