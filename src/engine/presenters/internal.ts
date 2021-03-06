import { Player } from '../models/player'
import { LevelMap } from '../models/level_map'
import { Tile } from '../models/tile'
import {
  Game,
  IdlePresenter,
  BaseInfoPresenter,
  EquipmentPresenter,
  HistoryInfoPresenter,
  TalentsPresenter,
  PowersInfoPresenter,
} from '../../engine'

export enum PresenterType {
  TalentsPicking,
  Death,
  Idle,
  ItemsListing,
  Missile,
  ProfessionPicking,
  Look,
  Teleportation,
  PickHandleOption,
  CharacterInfo,
}

export abstract class Presenter {
  public player: Player

  abstract get type(): PresenterType

  constructor(protected levelMap: LevelMap, protected game: Game) {
    this.player = this.game.player
  }

  get tile(): Tile {
    return this.levelMap.creatureTile(this.player)
  }

  protected endTurn(): void {
    this.game.player.ai.endTurn(this.game, this.levelMap)
  }

  protected redirect(presenter: Presenter): void {
    this.game.player.ai.redirect(presenter)
  }

  public goIdle(): void {
    this.redirect(new IdlePresenter(this.levelMap, this.game))
  }
}

export abstract class BaseMenusPresenter extends Presenter {
  public goToPowers(): void {
    this.redirect(new PowersInfoPresenter(this.levelMap, this.game))
  }

  public goToBaseInfo(): void {
    this.redirect(new BaseInfoPresenter(this.levelMap, this.game))
  }

  public goToInventory(): void {
    this.redirect(new EquipmentPresenter(this.levelMap, this.game))
  }

  public goToHistoryInfo(): void {
    this.redirect(new HistoryInfoPresenter(this.levelMap, this.game))
  }

  public goToTalents(): void {
    this.redirect(new TalentsPresenter(this.levelMap, this.game))
  }
}
