import { Game } from 'src/game'
import { Player } from 'src/creature'
import { Profession } from 'src/profession'

export enum ScreenType {
  LevelUp,
  Idle,
  AbilitiesPicking,
  Inventory,
  ItemsListing,
}

export abstract class Screen {
  public player: Player

  constructor(public readonly type: ScreenType, protected game: Game) {
    this.player = this.game.player
  }

  public build() {}
}

export class LevelUpScreen extends Screen {
  public options: Profession[]

  constructor(game: Game) {
    super(ScreenType.LevelUp, game)
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

    this.game.screen = undefined
  }
}
