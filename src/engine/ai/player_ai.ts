import { MetaAI, AIEvent } from './meta_ai'
import { Player } from '../models/creature'
import {
  IdlePresenter,
  Game,
  TalentsTreePresenter,
  ProfessionPickingPresenter,
  LevelMap,
} from '../../engine'
import { Presenter } from '../presenters/internal'
import { DieReason } from '../events/die_event'
import { DeathPresenter } from '../presenters/death_presenter'
import { CreatureEvent } from '../events/internal'

export class AINewLevelEvent extends AIEvent {
  constructor(public level: number, private levelMap: LevelMap, game: Game) {
    super(game)
  }

  public run(): void {
    if (!this.game.ai) {
      throw 'AINewLevelEvent.run: game.ai is undefined'
    }

    if (this.level % 3 === 0) {
      this.game.ai.presenter = new ProfessionPickingPresenter(
        this.level,
        this.levelMap,
        this.game
      )
    } else {
      this.game.ai.presenter = new TalentsTreePresenter(
        this.level,
        this.levelMap,
        this.game
      )
    }
  }

  public immediate(): boolean {
    return true
  }
}

export class AIDieEvent extends AIEvent {
  constructor(
    private dieReason: DieReason,
    private levelMap: LevelMap,
    game: Game
  ) {
    super(game)
  }

  public run(): void {
    if (!this.game.ai) {
      throw 'AINewLevelEvent.run: game.ai is undefined'
    }

    this.game.ai.presenter = new DeathPresenter(
      this.dieReason,
      this.levelMap,
      this.game
    )
  }

  public immediate(): boolean {
    return true
  }
}

export class PlayerAI extends MetaAI {
  public presenter: Presenter | null = null
  private game: Game | undefined
  public levelUps: number = 0

  public act(
    player: Player,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    this.game = game

    this.presenter = new IdlePresenter(levelMap, this.game)
    this.game.ai = this

    return
  }

  public endTurn(): void {
    let event = this.events.pop()
    if (event) {
      event.run()
    } else if (this.game) {
      this.game.ai = null
      this.presenter = null
    }
  }

  public redirect(presenter: Presenter): void {
    this.presenter = presenter
  }
}
