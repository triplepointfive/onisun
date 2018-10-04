import {
  CharacterInfoPresenter,
  CharacterInfoPage,
} from './character_info_presenter'
import { Power } from '../models/creature'

export class PowersInfoPresenter extends CharacterInfoPresenter {
  get page(): CharacterInfoPage {
    return CharacterInfoPage.Powers
  }

  get powers(): Power[] {
    return this.player.specie.powers
  }
}
