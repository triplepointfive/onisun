import { Point, twoDimArray } from '../utils'
import { AI } from '../ai'
import { Explorer } from '../ai/explorer'

import { LevelMap, Tile } from '../map'

import { Memory, Creature } from '../creature'

export class Walker extends Creature {
  constructor(x: number, y: number, radius: number = 10, levelMap) {
    super(x, y, radius, levelMap)
    this.ai = new Explorer()
  }
}
