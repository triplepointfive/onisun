import { Game } from './game'
import { Player } from './creature'

export abstract class Screen {
  constructor(
    protected game: Game,
    // protected onDone: () => void,
  ) {}

  public build() {}

  public onInput() {
    this.game.screen = undefined
  }
}

export class LevelUp extends Screen {
  constructor(
    game: Game,
    public player: Player,
    // onDone: () => void,
  ) {
    super(game)
    // super(onDone)
  }

  public onInput() {
    while (this.player.levelUps > 0) {
      this.player.characteristics.levelUp(this.player.specie)

      this.player.levelUps -= 1
    }

    // this.onDone()
    this.game.screen = undefined
  }
}
