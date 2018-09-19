import { Presenter, PresenterType } from './internal'
import {
  TalentsPresenter,
  EquipmentPresenter,
  BaseInfoPresenter,
} from '../../engine'
import { PlayerSpecie } from '../models/specie'
import { LevelMap } from '../models/level_map'
import { Game } from '../models/game'

export enum CharacterInfoPage {
  Base,
  Talents,
  Equipment,
}

export abstract class CharacterInfoPresenter extends Presenter {
  constructor(levelMap: LevelMap, game: Game) {
    super(levelMap, game)
  }

  get type(): PresenterType {
    return PresenterType.CharacterInfo
  }

  public goToBaseInfo(): void {
    this.redirect(new BaseInfoPresenter(this.levelMap, this.game))
  }

  public goToInventory(): void {
    this.redirect(new EquipmentPresenter(this.levelMap, this.game))
  }

  public goToTalents(): void {
    this.redirect(new TalentsPresenter(this.levelMap, this.game))
  }

  abstract get page(): CharacterInfoPage

  protected get specie(): PlayerSpecie {
    return this.game.player.specie
  }
}
