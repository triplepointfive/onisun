import { Presenter, PresenterType } from './internal'
import { Color, Gender } from '../../engine'
import { PlayerSpecie } from '../models/specie'

export class CharacterInfoPresenter extends Presenter {
  get type(): PresenterType {
    return PresenterType.CharacterInfo
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

  private get specie(): PlayerSpecie {
    return this.game.player.specie
  }
}
