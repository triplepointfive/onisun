import {
  centralize,
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
} from '../../engine'
import { LogMessageTrigger } from '../../engine/models/tile'
import { OnisunTeleportationTrap } from '../tiles/traps'
import { rat } from '../creatures';

const tiles: Map<string, () => Tile> = new Map()
tiles.set('C', () => new Corridor('C', TileTypes.Floor))
tiles.set('W', () => new Wall())
tiles.set('R', () => new Floor('R', TileTypes.Floor))
tiles.set('D', () => new Door())

const initId: number = 1,
      ratId = initId + 1

export class TutorialDungeon extends Dungeon {
  public enter(game: Game, player: Player): void {
    const levelMap = (game.currentMap = game.getMap(initId))

    levelMap.addCreature(new Point(1, 1), player)
  }

  public register(game: Game): void {
    game.addMap(initId, (id, game) => {
      let map = this.generateMap(id, ratId, undefined)
      map.setTile(2, 1, new LogMessageTrigger('Welcome', true, map.at(2, 1)))
      map.setTile(2, 4, new OnisunTeleportationTrap())
      return map
    })

    game.addMap(initId + 1, (id, game) => {
      let map = this.generateMap(id, undefined, initId)
      map.setTile(2, 2, new OnisunTeleportationTrap())
      map.addCreature(new Point(2, 4,), rat())
      return map
    })
  }

  private generateMap(
    id: number,
    downId: number | undefined,
    upId: number | undefined
  ): LevelMap {
    let map = new LevelMap(
      id,
      drawn(
        ['WWWWW', 'WRRRW', 'WWCWW', 'WRRRW', 'WRRRW', 'WRRRW', 'WWWWW'],
        tiles
      )
    )

    centralize(map)
    map.name = `MP ${id}`

    if (downId !== undefined) {
      map.setTile(3, 1, new StairwayDown(map, downId))
    }

    if (upId !== undefined) {
      map.setTile(1, 1, new StairwayUp(map, upId))
    }

    return map
  }
}
