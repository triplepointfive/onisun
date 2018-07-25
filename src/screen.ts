import { Game } from './game'
import { Player } from './creature'
import { Profession } from './profession'

export abstract class Screen {
  constructor(protected game: Game) // protected onDone: () => void,
  {}

  public build() {}

  public onInput(input: any) {
    this.game.screen = undefined
  }
}

export class LevelUp extends Screen {
  public options: Profession[]

  constructor(game: Game, public player: Player) // onDone: () => void,
  {
    super(game)
    // super(onDone)
    this.options = this.game.professionPicker.available(this.player)
  }

  public onInput(pickedProfession: Profession) {
    while (this.player.levelUps > 0) {
      this.player.characteristics.levelUp(this.player.specie)

      this.player.levelUps -= 1
    }

    let playerProfession = this.player.professions.find(
      profession => profession.id === pickedProfession.id
    )
    if (playerProfession) {
      playerProfession.level += 1
    } else {
      this.player.professions.push(pickedProfession)
    }

    // this.onDone()
    this.game.screen = undefined
  }
}
