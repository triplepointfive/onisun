import { Game } from './game'
import { Player } from './creature'

export abstract class Screen {
  public Scene
  constructor(
    protected game: Game,
    // protected onDone: () => void,
  ) {}

  public build() {}

  public onInput() {
    this.game.screen = undefined
  }
}

export class Scene extends Screen {

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

    // while (this.levelUps > 0) {
    //   this.characteristics.levelUp(this.specie)

    //   this.levelUps -= 1
    // }





    // this.onDone()
    this.game.screen = undefined
  }
}
