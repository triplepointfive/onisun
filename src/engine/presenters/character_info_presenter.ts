import { PresenterType, BaseMenusPresenter } from './internal'
import {
  TalentsPresenter,
  EquipmentPresenter,
  BaseInfoPresenter,
  HistoryInfoPresenter,
} from '../../engine'
import { PlayerSpecie } from '../models/specie'
import { LevelMap } from '../models/level_map'
import { Game } from '../models/game'

export enum CharacterInfoPage {
  Base,
  Talents,
  Equipment,
  History,
  Powers,
}

export abstract class CharacterInfoPresenter extends BaseMenusPresenter {
  constructor(levelMap: LevelMap, game: Game) {
    super(levelMap, game)
  }

  get type(): PresenterType {
    return PresenterType.CharacterInfo
  }

  abstract get page(): CharacterInfoPage

  protected get specie(): PlayerSpecie {
    return this.game.player.specie
  }
}
