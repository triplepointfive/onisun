import { GoToTileAI } from '../ai'
import { MetaAI } from './meta_ai'

export class Explorer extends GoToTileAI {
  constructor(metaAI: MetaAI) {
    super(metaAI, tile => !tile.seen)
  }
}
