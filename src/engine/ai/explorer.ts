import { GoToTileAI } from './internal'

export class Explorer extends GoToTileAI {
  constructor() {
    super(tile => !tile.seen)
  }
}
