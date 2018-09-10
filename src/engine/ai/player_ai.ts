import { MetaAI, AIEvent } from './meta_ai'
import { Player } from '../models/player'
import {
  IdlePresenter,
  Game,
  TalentsTreePresenter,
  ProfessionPickingPresenter,
  LevelMap,
  AfterEvent,
  TeleportationPresenter,
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
    if (this.level % 3 === 0) {
      this.game.player.ai.presenter = new ProfessionPickingPresenter(
        this.level,
        this.levelMap,
        this.game
      )
    } else {
      this.game.player.ai.presenter = new TalentsTreePresenter(
        this.level,
        this.levelMap,
        this.game
      )
    }
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
    this.game.playerTurn = true
    this.game.player.ai.presenter = new DeathPresenter(
      this.dieReason,
      this.levelMap,
      this.game
    )
  }
}

export class AITeleportationEvent extends AIEvent {
  constructor(private levelMap: LevelMap, game: Game) {
    super(game)
  }

  public run(): void {
    // TODO: Rethink whether should be here
    this.game.player.rebuildVision(this.levelMap)
    this.game.playerTurn = true
    this.game.player.ai.presenter = new TeleportationPresenter(
      this.levelMap,
      this.game
    )
  }
}

export class PlayerAI extends MetaAI {
  public presenter: Presenter | null = null
  private game: Game | undefined
  private levelMap: LevelMap | undefined
  public levelUps: number = 0

  public act(
    player: Player,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    this.game = game
    this.levelMap = levelMap

    this.presenter = new IdlePresenter(levelMap, this.game)
    this.game.playerTurn = true

    return
  }

  public endTurn(): void {
    let event = this.events.pop()
    if (event) {
      event.run()
    } else if (this.game && this.levelMap) {
      this.game.player.on(new AfterEvent(this.levelMap, this.game))

      let event = this.events.pop()
      if (event) {
        event.run()
      } else {
        this.game.player.ai.runEvents()
        this.game.playerTurn = false
        this.presenter = null
      }
    }
  }

  public redirect(presenter: Presenter): void {
    this.presenter = presenter
  }
}
