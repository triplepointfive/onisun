import { Fov } from '../utils/fov'
import { TileVisitor, Door, Tile } from '../models/tile'
import { LevelMap } from '../models/level_map'
import { Point } from '../utils/utils'
import { Memory } from '../models/memory'

class VisibilityTileVisitor extends TileVisitor {
  public visible: boolean = false
  private x: number | undefined
  private y: number | undefined

  constructor(private stage: LevelMap, private pos: Point) {
    super()
  }

  public isSolid(x: number, y: number): boolean {
    this.x = x
    this.y = y
    this.stage.at(x, y).visit(this)
    return !this.visible
  }

  public onDoor(door: Door) {
    this.default(door)
    this.visible =
      this.visible || (this.pos.x === this.x && this.pos.y === this.y)
  }

  protected default(tile: Tile) {
    if (this.x && this.y) {
      this.visible = this.stage.visibleThrough(this.x, this.y)
    }
  }
}

export const buildFov = function(
  pos: Point,
  radius: number,
  memory: Memory,
  levelMap: LevelMap
): void {
  const see = (x: number, y: number, degree: number): void => {
    memory.at(x, y).see(levelMap.at(x, y), degree)
  }

  new Fov(
    pos.x,
    pos.y,
    radius,
    levelMap.width,
    levelMap.height,
    new VisibilityTileVisitor(levelMap, pos),
    see
  ).calc()
}
