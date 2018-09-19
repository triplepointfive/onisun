import {
  CharacterInfoPresenter,
  CharacterInfoPage,
} from './character_info_presenter'
import { Profession } from '../models/profession'

export class TalentsPresenter extends CharacterInfoPresenter {
  get page(): CharacterInfoPage {
    return CharacterInfoPage.Talents
  }

  get professions(): Profession[] {
    return this.player.professions
  }
}
