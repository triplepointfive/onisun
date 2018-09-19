import { Presenter, PresenterType } from './internal'
import { Color, Gender, EquipmentPresenter } from '../../engine'
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

  abstract get page(): CharacterInfoPage

  protected get specie(): PlayerSpecie {
    return this.game.player.specie
  }
}

export class BaseInfoPresenter extends CharacterInfoPresenter {
  get page(): CharacterInfoPage {
    return CharacterInfoPage.Base
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
}

export class TalentsPresenter extends CharacterInfoPresenter {
  get page(): CharacterInfoPage {
    return CharacterInfoPage.Talents
  }
}
