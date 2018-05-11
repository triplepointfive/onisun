import { Point, twoDimArray } from '../utils'
import { AI, Loiter, Explorer } from '../ai'

import { LevelMap, Tile } from '../map'

import { Memory, Creature } from '../creature'

export class Walker extends Creature {
  constructor(x: number, y: number, radius: number = 10, levelMap) {
    super(x, y, radius, levelMap)
    this.ai = new Explorer()
  }
}
