import { Point, twoDimArray } from '../utils'
import { AI } from '../ai'
import { Explorer } from '../ai/explorer'

import { Fov } from '../fov'
import { LevelMap, Tile } from '../map'

import { Memory, Creature } from '../creature'

// TODO: Ensure seen is build before act() is called!
export class Walker extends Creature {
  public x: number
  public y: number

  constructor(x: number, y: number, private radius: number = 10, width, height) {
    super()
    this.x = x
    this.y = y
    this.stageMemory = new Memory(width, height)
    this.ai = new Explorer()
    this.previousPos = { x, y }
  }

  act(stage: LevelMap): void {
    this.visionMask( stage )
    this.previousPos = { x: this.x, y: this.y }
    this.ai.act( this )
    stage.at(this.previousPos.x, this.previousPos.y).creature = undefined
    stage.at(this.x, this.y).creature = this
  }

  private visionMask(stage: LevelMap): void {
    this.stageMemory.resetVisible()

    const see = (x: number, y: number, degree: number): void => {
      const tile = this.stageMemory.at(x, y)
      tile.visible = true
      tile.degree = degree
      tile.seen = true
      tile.tangible = !stage.passibleThrough(x, y)
      tile.tile = stage.at(x, y)
    }

    new Fov(
      this.x,
      this.y,
      this.radius,
      stage.width,
      stage.height,
      this.isSolid(stage),
      see,
    ).calc()
  }

  private isSolid(stage: LevelMap): (x: number, y: number) => boolean {
    return (x: number, y: number) => {
      if (stage.visibleThrough(x, y)) {
        return false
      } else {
        return !(stage.at(x, y).isDoor() && this.x === x && this.y === y)
      }
    }
  }
}
