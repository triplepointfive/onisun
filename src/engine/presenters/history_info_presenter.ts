import {
  CharacterInfoPresenter,
  CharacterInfoPage,
} from './character_info_presenter'
import { Gender, Color, Race } from '../../engine'

export class HistoryInfoPresenter extends CharacterInfoPresenter {
  get page(): CharacterInfoPage {
    return CharacterInfoPage.History
  }

  get name(): string {
    return this.player.name
  }

  get weight(): number {
    return this.specie.weight
  }

  get height(): number {
    return this.specie.height
  }

  get gender(): Gender {
    return this.specie.gender
  }

  get eyeColor(): Color {
    return this.specie.eyeColor
  }

  get hairColor(): Color {
    return this.specie.hairColor
  }

  get skinColor(): Color {
    return this.specie.skinColor
  }

  get race(): Race {
    return this.player.specie.race
  }

  get turns(): number {
    return this.game.turns
  }
}
