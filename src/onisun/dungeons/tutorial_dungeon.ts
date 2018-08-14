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

const initId: number = -1

const config = {
  addDoors: false,
  minSize: 3,
  maxSize: 10,
  roomsCount: 10,
  simple: false,
}

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
      addCreatures(0.3, this.addStairDown(this.generateMap(id), 0), creaturesPool1)
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
      dungeon(40, 30, config.minSize, config.maxSize, config.roomsCount)
    )

    if (config.simple) {
      map = new LevelMap(
        id,
        drawn([
          'WWWWWWWWWWWWWWWWWWWWWW',
          'WRRRRRRRRRRRRRRRRRRRRW',
          'WRRRRRRRRRRRRRRRRRRRRW',
          'WRRRRRRRRRRRRRRRRRRRRW',
          'WRRRRRRRRRRRRRRRRRRRRW',
          'WRRRRRRRRRRRRRRRRRRRRW',
          'WWWWWWWWWWWWWWWWWWWWWW',
        ])
      )
    }

    if (config.addDoors) {
      addDoors(map)
    }
    centralize(map)
    map.game = this.game
    map.name = `MP ${id}`

    addItems(0.05, map, weapons.merge(itemsPool))

    return map
  }
}
