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
} from '../../engine'
import { rat } from '../creatures'

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

    levelMap.addCreature(new Point(5, 2), player)
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
      map.setTile(2, 6, new TeleportationTrap())

      return map
    })

    game.addMap(ratId, (id, game) => {
      let map = this.generateMap(id, [
        'WWWWW',
        'WRRRW',
        'WRRRW',
        'WRRRW',
        'WWWWW',
      ])
      map.name = '2nd'
      map.setTile(2, 2, new TeleportationTrap())
      map.addCreature(new Point(2, 4), rat())
      // map.setTile(3, 1, new StairwayDown(map, downId))
      // map.setTile(1, 1, new StairwayUp(map, upId))
      return map
    })
  }

  private generateMap(id: number, scheme: string[]): LevelMap {
    let map = new LevelMap(id, drawn(scheme, tiles))

    return map
  }
}
