import {
  CharacterInfoPresenter,
  CharacterInfoPage,
} from './character_info_presenter'

export class BaseInfoPresenter extends CharacterInfoPresenter {
  get page(): CharacterInfoPage {
    return CharacterInfoPage.Base
  }
}
