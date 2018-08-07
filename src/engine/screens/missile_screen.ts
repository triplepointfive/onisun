import { Screen, ScreenType } from './internal'
import { Game } from '../game'

export class MissileScreen extends Screen {
  constructor(game: Game) {
    super(ScreenType.Missile, game)
  }
}
