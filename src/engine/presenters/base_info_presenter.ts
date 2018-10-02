import {
  CharacterInfoPresenter,
  CharacterInfoPage,
} from './character_info_presenter'

export class BaseInfoPresenter extends CharacterInfoPresenter {
  get page(): CharacterInfoPage {
    return CharacterInfoPage.Base
  }

  get currentLevel(): number {
    return this.player.level.current
  }

  get currentExperience(): string {
    return `${this.player.level.currentExperience}/${
      this.player.level.requiredExperience
    }`
  }
}
