import { MetaAI } from './meta_ai'
import { GoToTileAI } from './internal'

export class Explorer extends GoToTileAI {
  constructor(metaAI: MetaAI) {
    super(metaAI, tile => !tile.seen)
  }
}
